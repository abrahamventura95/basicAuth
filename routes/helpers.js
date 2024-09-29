import jwt from "jsonwebtoken";
import { config as _config } from "dotenv";

_config();
const secret = process.env.SECRET_KEY;
const url = process.env.EXTERNAL_URL;

export function formatValidationErrors(errors) {
  return Object.values(errors).map((err) => err.message);
}

export function getToken(email) {
  return jwt.sign({ email }, secret);
}

export function tokenResponse(token) {
  return { token, type: "Bearer" };
}

export async function fetchApi({ first_name, last_name, email }) {
  try {
    const response = await fetch(`${url}/check-blacklist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name, last_name, email }),
    });
    if (!response.ok) {
      throw new Error("Bad request");
    }

    const data = await response.json();
    return data.is_in_blacklist;
  } catch (error) {
    throw new Error("Bad request");
  }
}

// Middleware for JWT validation
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};
