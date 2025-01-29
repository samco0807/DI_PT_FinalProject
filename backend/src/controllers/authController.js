import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// POST/api/auth/register

export const register = async (req, res) => {
  const { name, email, password } = req.body;
};

export const login = async (req, res) => {
  const { email, password } = req.body;
};
