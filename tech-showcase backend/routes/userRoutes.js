const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const userController = require("../controller/userController");
const asyncRouteHandler = require("../utils/asyncRouteHandler");

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("password")
      .trim()
      .isLength({
        min: 6,
      })
      .isAlphanumeric(),
  ],
  asyncRouteHandler(userController.signup)
);

router.post(
  "/login",
  [body("email").isEmail().not().isEmpty(), body("password").notEmpty()],
  asyncRouteHandler(userController.login)
);

router.post('/reset-password', asyncRouteHandler(userController.resetPassword))

router.post('/update-password', asyncRouteHandler(userController.updatePassword))

module.exports = router;
