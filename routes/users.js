import { Router } from "express";
import { User } from "../models/user.js";
import {
  formatValidationErrors,
  getToken,
  tokenResponse,
  fetchApi,
  verifyToken,
} from "./helpers.js";

export const userRoute = Router();

/**
 * @swagger
 * /api/v1:
 *   get:
 *     security: 
 *      - Bearer: []
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Login successful
 *              properties:
 *                user:
 *                  type: object
 *                  description: User logged
 *                  properties:
 *                    first_name:
 *                      type: string
 *                      description: User first name
 *                      example: Abraham
 *                    last_name:
 *                      type: string
 *                      description: User last name
 *                      example: Ventura
 *                    email:
 *                      type: string
 *                      description: User email
 *                      example: amsventura.95@gmail.com
 *
 *       500:
 *         description: Internal server error
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Error
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message
 *                  example: Internal Server Error
 *
 */
userRoute.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne(
      { email: req.user.email },
      { _id: 0, __v: 0, password: 0 },
    );
    res.status(200).send({ user });
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
});

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: User register.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: User first name
 *                 example: Abraham
 *               last_name:
 *                 type: string
 *                 description: User last name
 *                 example: Ventura
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: amsventura.95@gmail.com
 *               password:
 *                 type: string
 *                 description: Account password.
 *                 example: pasS!123
 *
 *     responses:
 *       201:
 *         description: Successful register
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Successful register
 *              properties:
 *                message:
 *                  type: string
 *                  description: Successful message
 *                  example: Successful register
 *                auth:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *                      description: Token
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC
 *                    type:
 *                      type: string
 *                      description: Bearer
 *                      example: Bearer
 *
 *       400:
 *         description: Data error
 *         content:
 *          'application/json':
 *            schema:
 *              type: array
 *              description: Error message
 *              items:
 *                type: string
 *                description: Errors
 *                example: email already registered
 *
 *       500:
 *         description: Creation error
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Error
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message
 *                  example: Unable to verify data at this time, please try again later.
 *
 */
userRoute.post("/register", async (req, res) => {
  try {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const isInBlackList = await fetchApi({ first_name, last_name, email });
    if (isInBlackList) {
      return res.status(400).send({
        message:
          "The user is blacklisted by PLD, and therefore the account cannot be created.",
      });
    }
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: req.body.password,
    });

    await newUser.save().catch((e) => {
      throw e;
    });
    res.status(201).send({
      message: "Successful register",
      auth: tokenResponse(getToken(req.body.email)),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).send({
        errors: formatValidationErrors(error.errors),
      });
    } else if (error.code === 11000) {
      res.status(400).send({ errors: ["email already registered"] });
    } else {
      res.status(500).send({
        error:
          "Unable to verify data at this time, please try again later.",
      });
    }
  }
});

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Account email
 *                 example: amsventura.95@gmail.com
 *               password:
 *                 type: string
 *                 description: Account password
 *                 example: pasS!123
 *
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Successful login
 *              properties:
 *                message:
 *                  type: string
 *                  description: Successful message
 *                  example: Successful login
 *                auth:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *                      description: Token
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC
 *                    type:
 *                      type: string
 *                      description: Bearer
 *                      example: Bearer
 *
 *       401:
 *         description: Not authenticated
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Error
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message
 *                  example: Wrong email or password
 *
 *       500:
 *         description: Server error
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Error
 *              properties:
 *                error:
 *                  type: string
 *                  description: Error message
 *                  example: Internal Server Error
 *
 */
userRoute.post("/login", async (req, res) => {
  try {
    const password = req.body.password;
    // Check if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ error: "Wrong email or password" });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({
          error: "Internal Server Error",
        });
      }
      if (isMatch) {
        return res.status(200).send({
          message: "Successful login",
          auth: tokenResponse(getToken(req.body.email)),
        });
      } else {
        return res
          .status(401)
          .send({ error: "Wrong email or password" });
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});
