import sgMail from "@sendgrid/mail";
import "dotenv/config";
if (!process.env.EMAIL_API) {
  console.log(
    "Warning: EMAIL_API environment variable is not set. Emails will not be sent."
  );
} else {
  sgMail.setApiKey(process.env.EMAIL_API);
}

export async function sendVerificationEmail(
  recipientEmail,
  name,
  verificationLink
) {
  const msg = {
    to: recipientEmail,
    from: process.env.SENDER_EMAIL,
    subject: "Action Required: Verify Your Email Address",
    text: `
Welcome, ${name}!

Thank you for registering. Please open the link below into your browser to verify your email address and activate your account:

Verification Link: ${verificationLink}

This link is valid for 24 hours.

If you did not initiate this request, please ignore this email.
        `,
  };

  try {
    await sgMail.send(msg);
    console.log(
      `Verification Email Sent successfully to ${recipientEmail} via SendGrid.`
    );
  } catch (error) {
    console.error("Failed to send verification email via SendGrid.");
  }
}
