const nodemailer = require("nodemailer");
const fs = require("fs");

// Manual simple parser for .env
function loadEnv() {
  try {
    const envFile = fs.readFileSync(".env", "utf8");
    envFile.split("\n").forEach((line) => {
      // Ignore comments and empty lines
      if (line.trim().startsWith("#") || !line.includes("=")) return;

      const [key, ...valueParts] = line.split("=");
      if (key && valueParts.length > 0) {
        let value = valueParts.join("=").trim();
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        process.env[key.trim()] = value;
      }
    });
    console.log("Loaded environment variables from .env");
  } catch (e) {
    console.log(
      "No .env file found or failed to read, using existing process.env",
    );
  }
}

loadEnv();

async function main() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE === "true" || true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const targetEmail = process.env.ADMIN_NOTIFY_EMAIL || "apirak@npu.ac.th";
  console.log("Attempting to send email from:", process.env.SMTP_USER);
  console.log("Sending to:", targetEmail);

  try {
    const info = await transporter.sendMail({
      from: `"NPU NextGen (Test)" <${process.env.SMTP_USER}>`,
      to: targetEmail,
      subject: "Test Email from NPU NextGen",
      text: "This is a test email to verify SMTP configuration.",
      html: "<b>This is a test email to verify SMTP configuration.</b>",
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}

main();
