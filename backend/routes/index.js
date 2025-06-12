const express = require("express");
const router = express.Router();

// Diğer rota dosyalarını içe aktarıyoruz
const authRoute = require("./auth.js");

// Her rotayı ilgili yol altında kullanıyoruz

router.use("/auth", authRoute);

module.exports = router;
