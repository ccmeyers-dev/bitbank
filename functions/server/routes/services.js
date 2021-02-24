const router = require("express").Router();
const multer = require("multer");

// controllers
const ServicesController = require("../controllers/services");

//middlewares
const auth = require("../middlewares/auth");
const permissions = require("../middlewares/permissions");
const validate = require("../middlewares/validate");

// validators
const { emailSchema } = require("../validators/email");

router.get(
  "/statistics",
  auth,
  permissions(["moderator", "admin"]),
  ServicesController.statistics
);

router.post(
  "/send-mail",
  auth,
  permissions(["admin"]),
  validate(emailSchema),
  ServicesController.sendMail
);

router.post(
  "/send-custom-mail",
  auth,
  permissions(["admin"]),
  validate(emailSchema),
  ServicesController.sendCustomMail
);

router.post("/inbound-mail", multer().any(), ServicesController.inboundMail);

router.post(
  "/custom-inbound-mail",
  multer().any(),
  ServicesController.customInboundMail
);

module.exports = router;
