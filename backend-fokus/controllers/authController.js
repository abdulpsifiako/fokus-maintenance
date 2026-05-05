const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const conndb = require("../configs/database");

// Helper
const sendEmail = require("../helpers/mail");

// Entity
const usersEntity = require("../entities/usersEntity");
const logEntity = require("../entities/logEntity");

// Model
const userModel = conndb.getRepository(usersEntity);
const logModel = conndb.getRepository(logEntity);

const tryoutModel = conndb.getRepository(require("../entities/tryoutEntity"));
const kelasOnlineModel = conndb.getRepository(
  require("../entities/kelasOnlineEntity"),
);
const programUtamaModel = conndb.getRepository(
  require("../entities/programUtamaEntity"),
);
const transaksiModel = conndb.getRepository(
  require("../entities/transaksiProgramEntity"),
);

module.exports = {
  daftar: async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(405).json({
          status: 405,
          success: false,
          message: "Method not allowed",
          error: error.array(),
        });
      }
      const { email, password } = req.body;

      const dataEmail = await userModel.findOne({
        where: {
          email: email,
        },
      });
      if (dataEmail) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Email telah digunakan",
          error: null,
        });
      }
      const hashPassword = await argon2.hash(password);
      const id = uuidv4();

      await sendEmail({
        to: email,
        subject: "Verifikasi Pendaftaran",
        template: "pendaftaran",
        context: {
          verificationUrl: `${process.env.URL_VERIFIKASI_FOKUS_LOCAL}auth/login?email=${email}&token=${id}`,
          year: new Date().getFullYear(),
        },
      });
      const referal = await generateReferralCode();
      await userModel.save({
        id: id,
        email: email,
        password: hashPassword,
        referal: referal,
      });

      return res.status(200).json({
        status: 200,
        success: true,
        message:
          "Pendaftaran berhasil, silakan cek email untuk mengaktifkan akun",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error: error,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const dataUser = await userModel.findOne({
        where: {
          email: email,
        },
      });

      if (!dataUser) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Akun tidak ditemukan",
          data: null,
        });
      }
      if (!dataUser || !dataUser.is_active) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Silakan periksa email Anda untuk mengaktifkan akun.",
          data: null,
        });
      }
      if (dataUser.is_deleted) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Pastikan email/password tidak salah dan akun telah aktif",
          data: null,
        });
      }
      const verifyPassword = await argon2.verify(dataUser.password, password);

      if (!verifyPassword) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Pastikan email/password tidak salah dan akun telah aktif",
          data: null,
        });
      }
      delete dataUser.password;

      const token = await jwt.sign(dataUser, process.env.TOKEN_JWT, {
        expiresIn: "12h",
      });

      const dataLogUser = await logModel
        .createQueryBuilder()
        .where(`properties ->> 'userId' = :id`, { id: dataUser.id })
        .andWhere(`is_active = :is_active`, { is_active: true })
        .getMany();

      const updatedLogs = dataLogUser.map((log) => {
        log.is_active = false;
        return log;
      });

      await logModel.save(updatedLogs);

      await logModel.save({
        properties: {
          userId: dataUser.id,
          token: token,
          email: email,
        },
        created_at: new Date(),
        is_active: true,
      });

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Login berhasil",
        data: [
          {
            token: token,
            role: dataUser.role,
          },
        ],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error: error,
      });
    }
  },
  konfirmasiEmail: async (req, res) => {
    try {
      const { email, token } = req.body;
      const dataUser = await userModel.find({
        where: {
          email: email,
          id: token,
        },
      });
      if (dataUser[0].is_active) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Token telah kadaluarsa",
          data: null,
        });
      }
      if (dataUser.length < 1) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Tidak menemukan akun",
          data: null,
        });
      }
      const updateSuccess = await userModel.update(
        {
          email: email,
          id: token,
        },
        {
          is_active: true,
        },
      );

      if (updateSuccess.affected != 1) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Tidak menemukan akun",
          data: null,
        });
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Status akun telah diaktifkan",
        data: [],
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error: error,
      });
    }
  },
  cekSession: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const token = req.token;

      const dataLogUser = await logModel
        .createQueryBuilder()
        .where(`properties ->> 'userId' = :id`, { id: id })
        .andWhere(`properties ->> 'token' = :token`, { token: token })
        .getMany();
      if (!dataLogUser[0].is_active) {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Session telah berakhir",
          data: null,
        });
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses",
        data: [
          {
            detail: req.detailUser,
          },
        ],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error: error,
      });
    }
  },
  logoutApp: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const token = req.token;

      const dataLogUser = await logModel
        .createQueryBuilder()
        .where(`properties ->> 'userId' = :id`, { id: id })
        .andWhere(`properties ->> 'token' = :token`, { token: token })
        .getMany();
      const updatedLogs = dataLogUser.map((log) => {
        log.is_active = false;
        return log;
      });
      await logModel.save(updatedLogs);
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses logout",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error: error,
      });
    }
  },
  addUserAndProgram: async (req, res) => {
    try {
      const { tryout, programUtama, kelasOnline, emailOnly } = req.body; // ✅ tambah emailOnly

      const dataEmail = await userModel.findOne({
        where: { email: req.body.email },
      });

      let id;
      let userResult;

      if (emailOnly) {
        // ✅ Mode email only — cari user existing, tidak buat user baru
        if (!dataEmail) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: "Email tidak ditemukan. Pastikan user sudah terdaftar.",
            error: null,
          });
        }
        id = dataEmail.id;
        userResult = dataEmail;
      } else {
        // ✅ Mode normal — cek duplikat lalu buat user baru
        if (dataEmail) {
          return res.status(404).json({
            status: 404,
            success: false,
            message: "Email telah digunakan",
            error: null,
          });
        }

        if (!req.body.password || !req.body.nama) {
          return res.status(400).json({
            status: 400,
            success: false,
            message: "Nama dan password wajib diisi",
            error: null,
          });
        }

        const hashPassword = await argon2.hash(req.body.password);
        id = uuidv4();
        const referal = await generateReferralCode();

        userResult = await userModel.insert({
          id,
          is_active: true,
          email: req.body.email,
          password: hashPassword,
          referal,
        });
        delete userResult.password;
      }

      // ✅ Sisanya sama persis — insert transaksi pakai id yang sudah ditentukan di atas
      if (tryout && tryout.length > 0) {
        for (const toId of tryout) {
          const toItem = await tryoutModel.findOne({ where: { id: toId } });
          if (!toItem) continue;

          const dataTransaksi = {
            id: generateNomorPembayaran(),
            user_id: id,
            jenis: "Tryout",
            program_id: toItem.id || "1",
            valid_until: null,
            status: "success",
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
            properties: {
              img: "/bni.png",
              name: "BNI",
              tipe: "",
              admin: 666,
              harga: toItem.properties.hargaPremium || 666,
              jenis: "Tryout",
              status: "CREATED",
              to_data: toItem,
              user_id: id,
              program_id: toItem.id,
              harga_akhir: toItem.properties.hargaPremium || 666,
              voucherCode: "",
              program_name: toItem.properties.judul,
            },
            bank: "BNI",
            metode: "bank_transfer",
            bank_response: {
              currency: "IDR",
              order_id: id,
              va_numbers: [{ bank: "bni", va_number: "6666666666666666" }],
              expiry_time: new Date(),
              merchant_id: "G776266591",
              status_code: "200",
              fraud_status: "accept",
              gross_amount: "183000.00",
              payment_type: "bank_transfer",
              signature_key:
                "7f1e58e73b63fda31185694252da93ea8c5780a981e347493042500a0481f13659c2fe2e28ae723e3101fa95e0b42424871fd9dd531369c144aa44b661848b7b",
              status_message: "Success, transaction is found",
              transaction_id: uuidv4(),
              payment_amounts: [{ amount: 666, paid_at: new Date() }],
              settlement_time: new Date(),
              transaction_time: new Date(),
              transaction_status: "settlement",
            },
            data_user: userResult,
          };

          const transaksi = transaksiModel.create(dataTransaksi);
          await transaksiModel.save(transaksi);
        }
      }

      if (programUtama && programUtama.length > 0) {
        for (const { program_id, bulan } of programUtama) {
          const programFokus = await programUtamaModel.findOne({
            where: { id: program_id },
          });
          if (!programFokus) continue;

          const dataTransaksi = {
            id: generateNomorPembayaran(),
            user_id: id,
            jenis: "Program Utama",
            program_id: programFokus.id,
            valid_until: (() => {
              const date = new Date();
              date.setMonth(date.getMonth() + bulan);
              return date;
            })(),
            status: "success",
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
            properties: {
              img: "/bni.png",
              bulan: 2,
              name: "BNI",
              tipe: "",
              admin: 666,
              harga: 666,
              jenis: "Program Utama",
              status: "CREATED",
              user_id: id,
              program_id: programFokus.id,
              harga_akhir: 666,
              voucherCode: "",
              program_name: programFokus.properties.name,
            },
            bank: "BNI",
            metode: "bank_transfer",
            bank_response: {
              currency: "IDR",
              order_id: id,
              va_numbers: [{ bank: "bni", va_number: "6666666666666666" }],
              expiry_time: new Date(),
              merchant_id: "G776266591",
              status_code: "200",
              fraud_status: "accept",
              gross_amount: "183000.00",
              payment_type: "bank_transfer",
              signature_key:
                "7f1e58e73b63fda31185694252da93ea8c5780a981e347493042500a0481f13659c2fe2e28ae723e3101fa95e0b42424871fd9dd531369c144aa44b661848b7b",
              status_message: "Success, transaction is found",
              transaction_id: uuidv4(),
              payment_amounts: [{ amount: 666, paid_at: new Date() }],
              settlement_time: new Date(),
              transaction_time: new Date(),
              transaction_status: "settlement",
            },
            data_user: userResult,
          };

          const transaksi = transaksiModel.create(dataTransaksi);
          await transaksiModel.save(transaksi);
        }
      }

      if (kelasOnline && kelasOnline.length > 0) {
        for (const toId of kelasOnline) {
          const kelasProgram = await kelasOnlineModel.findOne({
            where: { id: toId },
          });
          if (!kelasProgram) continue;

          const dataTransaksi = {
            id: generateNomorPembayaran(),
            user_id: id,
            jenis: "Kelas Online",
            program_id: kelasProgram.id,
            valid_until: null,
            status: "success",
            created_at: new Date(),
            updated_at: new Date(),
            is_deleted: false,
            properties: {
              img: "/bni.png",
              name: "BNI",
              tipe: "",
              admin: 666,
              harga: kelasProgram.properties.harga || 666,
              jenis: "Kelas Online",
              status: "CREATED",
              kelas_data: kelasProgram,
              user_id: id,
              program_id: kelasProgram.id,
              harga_akhir: kelasProgram.properties.harga || 666,
              voucherCode: "",
              program_name: kelasProgram.properties.judul,
            },
            bank: "BNI",
            metode: "bank_transfer",
            bank_response: {
              currency: "IDR",
              order_id: id,
              va_numbers: [{ bank: "bni", va_number: "6666666666666666" }],
              expiry_time: new Date(),
              merchant_id: "G776266591",
              status_code: "200",
              fraud_status: "accept",
              gross_amount: "183000.00",
              payment_type: "bank_transfer",
              signature_key:
                "7f1e58e73b63fda31185694252da93ea8c5780a981e347493042500a0481f13659c2fe2e28ae723e3101fa95e0b42424871fd9dd531369c144aa44b661848b7b",
              status_message: "Success, transaction is found",
              transaction_id: uuidv4(),
              payment_amounts: [{ amount: 666, paid_at: new Date() }],
              settlement_time: new Date(),
              transaction_time: new Date(),
              transaction_status: "settlement",
            },
            data_user: userResult,
          };

          const transaksi = transaksiModel.create(dataTransaksi);
          await transaksiModel.save(transaksi);
        }
      }

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses Tambah User",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        error: error,
      });
    }
  },
};

async function generateReferralCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code;
  let exists = true;

  while (exists) {
    // Panjang 6–8 karakter random
    const length = Math.floor(Math.random() * 3) + 6; // 6, 7, atau 8
    code = Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length)),
    ).join("");

    // cek ke database apakah sudah ada
    const check = await userModel.findOne({
      where: {
        referal: code,
      },
    });
    if (!check) {
      exists = false;
    }
  }
  return code;
}

function generateNomorPembayaran() {
  const random = Math.floor(Math.random() * 1000000000); // angka random 9 digit
  const epoch = Math.floor(Date.now() / 1000); // timestamp detik
  return `0B${random}C${epoch}`;
}
