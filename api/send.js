const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Only POST allowed" });
    return;
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ message: "All fields are required." });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_EMAIL_PASSWORD,
    },
  });

  // Enhanced Gmail-compatible template with better styling
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Form Submission</title>
      <style>
        /* Gmail-compatible styling - avoiding complex CSS selectors and properties */
        body { margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; color: #333333; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background-color: #0066cc; padding: 24px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { padding: 20px 30px; }
        .message-box { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 15px; margin: 15px 0; }
        .field { margin-bottom: 12px; }
        .field-label { font-weight: bold; color: #555555; }
        .footer { padding: 15px; text-align: center; font-size: 12px; color: #6c757d; background-color: #f8f9fa; border-top: 1px solid #e9ecef; }
        .button { display: inline-block; background-color: #0066cc; color: white; text-decoration: none; padding: 10px 20px; border-radius: 4px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="field">
            <span class="field-label">Name:</span> ${name}
          </div>
          <div class="field">
            <span class="field-label">Email:</span> <a href="mailto:${email}">${email}</a>
          </div>
          <div class="field">
            <span class="field-label">Message:</span>
          </div>
          <div class="message-box">
            ${message.replace(/\n/g, "<br>")}
          </div>
          
          <div style="margin-top: 20px;">
            <a href="mailto:${email}" class="button">Reply to ${name}</a>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from your portfolio contact form</p>
          <p>© ${new Date().getFullYear()} Your Portfolio</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.MY_EMAIL,
      subject: "New Contact Form Submission",
      html: htmlContent,
    });
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send message." });
  }
};