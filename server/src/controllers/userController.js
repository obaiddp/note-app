import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prismaClient.js";

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const isProd = process.env.NODE_ENV === "production";
const cookieName = process.env.COOKIE_NAME || "token";
const cookieOptions = {
  httpOnly: true,
  secure: isProd, // only over HTTPS in prod (Railway/Vercel)
  sameSite: isProd ? "none" : "lax", // cross-site allowed for prod
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    const token = signToken(user.id);
    res.cookie(cookieName, token, cookieOptions);

    const { password: _p, ...safeUser } = user;
    res.status(201).json({ user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user.id);
    res.cookie(cookieName, token, cookieOptions);

    const { password: _p, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie(cookieName, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
  res.json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
  const { password, ...safeUser } = req.user;
  res.json({ user: safeUser });
};
