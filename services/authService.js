import bcrypt from "bcrypt";
import gravatar from "gravatar";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";

const { UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env;

const nodeMailerConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_EMAIL,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodeMailerConfig);

export const findUser = (query) =>
  User.findOne({
    where: query,
  });

export const updateUser = async (query, data) => {
  const user = await findUser(query);
  if (!user) return null;

  return user.update(data, {
    returning: true,
  });
};

export const signupUser = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, {
    s: "250",
    d: "retro",
  });
  const verificationToken = uuidv4();

  const newUser = await User.create({
    ...payload,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const emailData = {
    subject: "Email verification",
    to: email,
    from: UKR_NET_EMAIL,
    html: `<h1>Hello!</h1>
    <p>Please verify your email: <a href="http://localhost:3000/api/auth/verify/${verificationToken}">Verify</a></p>`,
  };

  transport
    .sendMail(emailData)
    .then(() => console.log("Email sent successfully"))
    .catch((err) => console.log("Error sending email:", err.message));

  return newUser;
};

export const signinUser = async (payload) => {
  const { email, password } = payload;
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    throw HttpError(401, "Email or password incorrect");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password incorrect");
  }

  const token = createToken({ email });
  const result = await user.update({ token }, { returning: true });

  return {
    token,
    user: {
      email: result.email,
      subscription: result.subscription,
    },
  };
};

export const logoutUser = (query) => {
  return updateUser(query, { token: null });
};

export const updateUserAvatar = async (email, avatarURL) => {
  const user = await findUser(email);
  if (!user) {
    throw HttpError(401, "Not authorized");
  }

  return user.update({ avatarURL }, { returning: true });
};

export const verifyEmail = async (verificationToken) => {
  const user = await findUser({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  return user.update(
    { verify: true, verificationToken: null },
    { returning: true }
  );
};

export const resendVerifyEmail = async (email) => {
  const user = await findUser({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const emailData = {
    subject: "Email verification",
    to: email,
    from: UKR_NET_EMAIL,
    html: `<h1>Hello!</h1>
    <p>Please verify your email: <a href="http://localhost:3000/api/auth/verify/${user.verificationToken}">Verify</a></p>`,
  };

  return transport
    .sendMail(emailData)
    .then(() => console.log("Email sent successfully"))
    .catch((err) => console.log("Error sending email:", err.message));
};
