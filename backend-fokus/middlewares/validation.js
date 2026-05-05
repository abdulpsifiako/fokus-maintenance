const { body } = require("express-validator");

module.exports = {
  formSignup: [
    body("email").isEmail().withMessage("Silakan masukan email yang valid"),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Minimal password harus 5 karakter"),
    //   .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/)
    //   .withMessage(
    //     "Password harus mengandung huruf, angka, dan minimal 1 simbol (contoh: @$!%*?&)",
    //   ),
  ],
  formDataDiri: [
    body("namaLengkap").isLength({ min: 5 }).withMessage("Nama Minimal 5"),
    // body('username').matches(/^(?=(?:[^0-9]*[0-9]){2,})[a-z0-9]{8,}$/).withMessage("Username minimal 8 karakter kombinasi huruf kecil dan min 2 angka"),
    body("noWa")
      .isLength({ min: 10 })
      .withMessage("No Whatsapp minimal 10 angka")
      .matches(/^\d+$/)
      .withMessage("WA hanya angka yang diperbolehkan"),
    body("kabKota").notEmpty().withMessage("Kabupaten/Kota tidak boleh kosong"),
    body("prov").notEmpty().withMessage("Provinsi tidak boleh kosong"),
    body("tingkatPend")
      .notEmpty()
      .withMessage("Tingkat Pendidikan tidak boleh kosong"),
    // body("instag").notEmpty().withMessage("instagram tidak boleh kosong"),
  ],
  formCekUsername: [
    body("username").notEmpty().withMessage("Tidak boleh kosong"),
  ],
  formPin: [body("pin").notEmpty().withMessage("PIN Tidak Boleh Kosong")],
  formEmail: [
    body("email").isEmail().withMessage("Silakan masukan email yang valid"),
  ],
  formOTP: [
    body("otp").notEmpty().withMessage("OTP Tidak Boleh Kosong"),
    body("token").notEmpty().withMessage("Token Tidak Boleh Kosong"),
  ],
  formUpdateProfile: [
    body("name").notEmpty().withMessage("Nama tidak boleh kosong"),
    body("email").notEmpty().withMessage("Email tidak boleh kosong"),
    body("tingkat_pend")
      .notEmpty()
      .withMessage("Tingkat Pendidikan tidak boleh kosong"),
    body("provinsi").notEmpty().withMessage("Provinsi tidak boleh kosong"),
    body("kota_kab").notEmpty().withMessage("Kota/Kab tidak boleh kosong"),
    // body("instagram").notEmpty().withMessage("instagram tidak boleh kosong"),
    body("no_wa").notEmpty().withMessage("No Whatsapp tidak boleh kosong"),
  ],
};
