import bcrypt from "bcrypt";

import User from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";
import gravatar from "gravatar";

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

  const newUser = await User.create({
    ...payload,
    password: hashPassword,
    avatarURL,
  });
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
