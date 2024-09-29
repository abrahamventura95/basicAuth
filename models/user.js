import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, `Por favor, ingresar un correo válido.`],
  },
  password: {
    type: String,
    required: true,
    validate: [
      validator.isStrongPassword,
      `La contraseña debe incluir por lo menos 8 caracteres, 1 en minusculas, 1 en mayúsculas y 1 caracter especial.`,
    ],
  },
});

// Ref: https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
UserSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Create a User model based on the schema
export const User = mongoose.model("User", UserSchema);
