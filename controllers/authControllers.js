import fs from "node:fs/promises";
import path from "node:path";

import * as authServices from "../services/authService.js";

const avatarsPath = path.resolve("public", "avatars");

export const signup = async (req, res) => {
  const { email, subscription } = await authServices.signupUser(req.body);

  res.status(201).json({
    email,
    subscription,
  });
};

export const signin = async (req, res) => {
  const result = await authServices.signinUser(req.body);

  res.json({ ...result });
};

export const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

export const logout = async (req, res) => {
  const { id } = req.user;
  await authServices.logoutUser({ id });

  res.status(204).send();
};

export const updateAvatar = async (req, res) => {
  const { id } = req.user;

  if (!req.file) {
    throw HttpError(400, "No file to upload");
  }

  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);

  const result = await authServices.updateUserAvatar({ id }, avatarURL);

  res.json({
    avatarURL: result.avatarURL,
  });
};
