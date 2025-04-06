import { Router } from "express";

import ctrlWrapper from "../helpers/ctrlWrapper.js";
import validateBody from "../helpers/validateBody.js";

import auth from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

import {
  authSignupSchema,
  authSigninSchema,
  authVerifyEmailSchema,
} from "../schemas/authSchemas.js";

import {
  signup,
  signin,
  getCurrent,
  logout,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateBody(authSignupSchema),
  ctrlWrapper(signup)
);

authRouter.post("/login", validateBody(authSigninSchema), ctrlWrapper(signin));

authRouter.get("/current", auth, ctrlWrapper(getCurrent));

authRouter.post("/logout", auth, ctrlWrapper(logout));

authRouter.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  ctrlWrapper(updateAvatar)
);

authRouter.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));
authRouter.post(
  "/verify",
  validateBody(authVerifyEmailSchema),
  ctrlWrapper(resendVerifyEmail)
);

export default authRouter;
