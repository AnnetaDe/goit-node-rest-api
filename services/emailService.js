import nodemailer from "nodemailer";

const {UKR_NET_EMAIL, UKR_NET_PASSWORD, BASE_URL = 'http://localhost:3000'} = process.env;

const transport = nodemailer.createTransport({
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
});

export async function sendVerifyEmail(email, verificationToken) {
  const verifyLink = `${BASE_URL}/api/auth/verify/${verificationToken}`;

  await transport.sendMail({
    from: UKR_NET_EMAIL,
    to: email,
    subject: "Verify your email",
    html: `<p>Please verify your email by clicking <a href="${verifyLink}">this link</a>.</p>`,
    text: `Please verify your email: ${verifyLink}`,
  });
}
