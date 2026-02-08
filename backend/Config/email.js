import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: `"Edifix Learning" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

// Email templates
export const emailTemplates = {
  welcome: (username) => ({
    subject: 'Welcome to Edifix! ',
    html: `
      <h1>Welcome to Edifix, ${username}!</h1>
      <p>You're about to start an amazing journey into web development.</p>
      <p>Your learning path:</p>
      <ol>
        <li>HTML → CSS → JavaScript → Git → Deployment</li>
        <li>Node.js → Databases → Express.js → Middlewares → CORS → Deployment</li>
      </ol>
      <p>Let's get started!</p>
    `
  }),

  reminder: (username, lessonTitle) => ({
    subject: 'Time to Learn! ',
    html: `
      <h1>Hey ${username}!</h1>
      <p>Don't forget to continue your lesson: <strong>${lessonTitle}</strong></p>
      <p>Keep your streak going! </p>
    `
  }),

  examNotification: (username, courseName) => ({
    subject: 'Exam Time! ',
    html: `
      <h1>Hey ${username}!</h1>
      <p>You have an exam ready for: <strong>${courseName}</strong></p>
      <p>Good luck! You've got this! </p>
    `
  }),

  streakBroken: (username, previousStreak) => ({
    subject: 'Your Streak Ended ',
    html: `
      <h1>Hey ${username},</h1>
      <p>Your ${previousStreak}-day streak has ended.</p>
      <p>Don't worry! Start a new one today and come back stronger! </p>
    `
  })
};

export default transporter;
