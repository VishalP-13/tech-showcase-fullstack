const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const Mailgen = require("mailgen");

dotenv.config();

const User = require("../models/user");

const sendMail = async (toEmail, resetLink, name) => {
  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Posts Blog",
      link: "http://localhost:3000/terms",
    },
  });


  const response = {
    body: {
      greeting: 'Dear',
      signature: 'Sincerely',
      name: `${name}`,
      intro: "You have received this email because a password reset request for your account was received.",
      action: {
        instructions: 'Click the button below to reset your password:',
        button: {
            color: '#174524',
            text: 'Confirm your account',
            link: resetLink
        }
    },
      outro: "Looking forward to do more business with you...!!😀",
    },
  };


  const mail = MailGenerator.generate(response);

  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const message = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Your Reset Password Link from Posts Blog",
    html: mail,
  };

  await transporter.sendMail(message);
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  const existingUser = await User.findOne({
    email: email,
  });

  if (existingUser) {
    const error = new Error("User with this email already exists!");
    throw error;
  }

  const hashedPwd = await bcrypt.hash(password, 12);

  const user = new User({
    name: name,
    email: email,
    password: hashedPwd,
  });

  await user.save();

  res.status(201).json({
    message: "User Created Successfully..!!",
  });
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    const error = new Error("A user with this email could not be found.");
    error.statusCode = 401;
    throw error;
  }

  const isEqual = await bcrypt.compare(password, user.password);

  if (!isEqual) {
    const error = new Error("Wrong password!");
    error.statusCode = 401;
    throw error;
  }

  const accessToken = jwt.sign(
    {
      email: user.email,
      userId: user._id.toString(),
      name: user.name,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  res.cookie("jwtoken", accessToken, {
    expires: new Date(Date.now() + 3600000), //expires after 1hr
    httpOnly: true,
  });

  res.status(200).json({
    message: `${user.name} Found`,
    access_token: accessToken,
    user: {
      // userId: user._id.toString(),
      name: user.name,
      email: user.email,
    },
  });
};

exports.resetPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    const error = new Error("A user with this email could not be found.");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "100s",
  });
  const resetLink = `${process.env.FRONTEND_URL}?token=${token}`;

  await sendMail(email, resetLink, user.name);
  res.status(201).json({
    message: "Reset link sent to your email",
    email: user.email,
  });
};

exports.updatePassword = async (req, res, next) => {
  const { token, newPassword } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ email: decoded.email });
  if (!user) {
    const error = new Error("A user with this email could not be found.");
    error.statusCode = 401;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({
    message: "Password updated successfully",
  });
};
