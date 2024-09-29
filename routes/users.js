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
 *     summary: Retorna la informacion del usuario loggeado.
 *     responses:
 *       200:
 *         description: Se logro iniciar sesion
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Login exitoso
 *              properties:
 *                user:
 *                  type: object
 *                  description: Usuario loggeado
 *                  properties:
 *                    first_name:
 *                      type: string
 *                      description: Nombres del usuario
 *                      example: Abraham
 *                    last_name:
 *                      type: string
 *                      description: Apellidos del usuario
 *                      example: Ventura
 *                    email:
 *                      type: string
 *                      description: Email del usuario
 *                      example: amsventura.95@gmail.com
 *
 *       500:
 *         description: Error del servidor
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Error
 *              properties:
 *                error:
 *                  type: string
 *                  description: Mensaje de error
 *                  example: Oops! algo salio mal, por favor volver a intentar despues
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
      error: "Oops! algo salio mal, por favor volver a intentar despues",
    });
  }
});

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Registro de usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 description: Nombres del usuario.
 *                 example: Abraham
 *               last_name:
 *                 type: string
 *                 description: Apellidos del usuario.
 *                 example: Ventura
 *               email:
 *                 type: string
 *                 description: Correo electronico.
 *                 example: amsventura.95@gmail.com
 *               password:
 *                 type: string
 *                 description: Contraseña de la cuenta.
 *                 example: pasS!123
 *
 *     responses:
 *       201:
 *         description: Registro exitoso!
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Creacion exitosa
 *              properties:
 *                message:
 *                  type: string
 *                  description: Mensaje de exito
 *                  example: Registro exitoso
 *                auth:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *                      description: Token
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                    type:
 *                      type: string
 *                      description: Bearer
 *                      example: Bearer
 *
 *       400:
 *         description: Error en la data
 *         content:
 *          'application/json':
 *            schema:
 *              type: array
 *              description: Mensajes de error
 *              items:
 *                type: string
 *                description: Errores
 *                example: Su correo ya esta registrado
 *
 *       500:
 *         description: Error en creacion
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Error
 *              properties:
 *                error:
 *                  type: string
 *                  description: Mensaje de error
 *                  example: No se puede verificar los datos actualmente, por favor intente mas tarde
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
          "El usuario se encuentra en lista negra de PLD, por lo que no se puede crear la cuenta",
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
      message: "Registro exitoso",
      auth: tokenResponse(getToken(req.body.email)),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(400).send({
        errors: formatValidationErrors(error.errors),
      });
    } else if (error.code === 11000) {
      res.status(400).send({ errors: ["Su correo ya esta registrado"] });
    } else {
      res.status(500).send({
        error:
          "No se puede verificar los datos actualmente, por favor intente mas tarde",
      });
    }
  }
});

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Inicio de sesion.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electronico.
 *                 example: amsventura.95@gmail.com
 *               password:
 *                 type: string
 *                 description: Contraseña de la cuenta.
 *                 example: pasS!123
 *
 *     responses:
 *       200:
 *         description: Se logro iniciar sesion
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Login exitoso
 *              properties:
 *                message:
 *                  type: string
 *                  description: Mensaje de exito
 *                  example: Inicio de sesion exitoso
 *                auth:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *                      description: Token
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                    type:
 *                      type: string
 *                      description: Bearer
 *                      example: Bearer
 *
 *       401:
 *         description: No autenticado
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Error
 *              properties:
 *                error:
 *                  type: string
 *                  description: Mensaje de error
 *                  example: Correo o contraseña equivocados
 *
 *       500:
 *         description: Error del servidor
 *         content:
 *          'application/json':
 *            schema:
 *              type: object
 *              description: Error
 *              properties:
 *                error:
 *                  type: string
 *                  description: Mensaje de error
 *                  example: Oops! algo salio mal, por favor volver a intentar despues
 *
 */
userRoute.post("/login", async (req, res) => {
  try {
    const password = req.body.password;
    // Check if the email exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ error: "Correo o contraseña equivocados" });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({
          error: "Oops! algo salio mal, por favor volver a intentar despues",
        });
      }
      if (isMatch) {
        return res.status(200).send({
          message: "Inicio de sesion exitoso",
          auth: tokenResponse(getToken(req.body.email)),
        });
      } else {
        return res
          .status(401)
          .send({ error: "Correo o contraseña equivocados" });
      }
    });
  } catch (error) {
    return res.status(500).json({
      error: "Oops! algo salio mal, por favor volver a intentar despues",
    });
  }
});
