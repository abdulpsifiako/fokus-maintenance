const conndb = require("../configs/database");
const snap = require("../configs/midtrans");
const crypto = require("crypto");

const transaksiModel = conndb.getRepository(
  require("../entities/transaksiProgramEntity"),
);
const redeemModel = conndb.getRepository(require("../entities/reedemEntity"));
const userModel = conndb.getRepository(require("../entities/usersEntity"));

module.exports = {
  createTransaksiTO: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { data_transaksi } = req.body;
      const orderid = generateNomorPembayaran();

      await transaksiModel.insert({
        bank: "FREEBANK",
        bank_response: {
          currency: "IDR",
          order_id: orderid,
          va_numbers: [
            {
              bank: "FREEBANK",
              va_number: "FREEBANK2025",
            },
          ],
          expiry_time: new Date(),
          merchant_id: "G776266591",
          status_code: "200",
          fraud_status: "accept",
          gross_amount: Number(data_transaksi.harga_akhir),
          payment_type: "WEB",
          signature_key: "2025",
          status_message: "Success, transaction is found",
          transaction_id: orderid,
          settlement_time: new Date(),
          transaction_time: new Date(),
          payment_amounts: [],
          transaction_type: "on-us",
          transaction_status: "settlement",
        },
        id: orderid,
        jenis: data_transaksi.jenis,
        program_id: data_transaksi.program_id,
        metode: "WEB",
        user_id: id,
        properties: data_transaksi.to_data,
        data_user: req.detailUser,
        status: "success",
      });

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses create transaksi",
        data: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  createTransaksiTONolPremium: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { data_transaksi } = req.body;
      const orderid = generateNomorPembayaran();

      await transaksiModel.insert({
        bank: "RP 0",
        bank_response: {
          currency: "IDR",
          order_id: orderid,
          va_numbers: [
            {
              bank: "RP 0",
              va_number: "RP02025",
            },
          ],
          expiry_time: new Date(),
          merchant_id: "G776266591",
          status_code: "200",
          fraud_status: "accept",
          gross_amount: Number(data_transaksi.harga_akhir),
          payment_type: "WEB",
          signature_key: "2025",
          status_message: "Success, transaction is found",
          transaction_id: orderid,
          settlement_time: new Date(),
          transaction_time: new Date(),
          payment_amounts: [],
          transaction_type: "on-us",
          transaction_status: "settlement",
        },
        id: orderid,
        jenis: data_transaksi.jenis,
        program_id: data_transaksi.program_id,
        metode: "WEB",
        user_id: id,
        properties: data_transaksi.to_data,
        data_user: req.detailUser,
        status: "success",
      });

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses create transaksi",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  createTransaksiKelas: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { data_transaksi } = req.body;
      const orderid = generateNomorPembayaran();

      await transaksiModel.insert({
        bank: "FREEBANK",
        bank_response: {
          currency: "IDR",
          order_id: orderid,
          va_numbers: [
            {
              bank: "FREEBANK",
              va_number: "FREEBANK2025",
            },
          ],
          expiry_time: new Date(),
          merchant_id: "G776266591",
          status_code: "200",
          fraud_status: "accept",
          gross_amount: 0,
          payment_type: "WEB",
          signature_key: "2025",
          status_message: "Success, transaction is found",
          transaction_id: orderid,
          settlement_time: new Date(),
          transaction_time: new Date(),
          payment_amounts: [],
          transaction_type: "on-us",
          transaction_status: "settlement",
        },
        id: orderid,
        jenis: data_transaksi.jenis,
        program_id: data_transaksi.program_id,
        metode: "WEB",
        user_id: id,
        properties: data_transaksi.kelas_data,
        data_user: req.detailUser,
        status: "success",
      });

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses create transaksi",
        data: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  createPembelianTO: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { data_transaksi } = req.body;

      let data = {
        payment_type: "bank_transfer",
        bank_transfer: {
          bank: data_transaksi.name.toLowerCase(),
        },
        item_details: [
          { ...data_transaksi, quantity: 1, price: data_transaksi.harga_akhir },
        ],
        transaction_details: {
          order_id: generateNomorPembayaran(),
          gross_amount: Number(data_transaksi.harga_akhir), // harus angka
        },
        customer_details: req.detailUser,
      };

      if (data_transaksi.name === "QRIS") {
        delete data.bank_transfer;
        data = {
          ...data,
          payment_type: "qris",
        };
      }

      const serverKey = process.env.MIDTRANS_S_KEY; // ganti dengan server key
      const authString = Buffer.from(
        serverKey + ":" + process.env.MIDTRANS_S_PASS,
      ).toString("base64");

      const response = await fetch(process.env.URL_MIDTRANS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      await transaksiModel.insert({
        bank: data_transaksi.name.toUpperCase(),
        bank_response: result,
        id: data.transaction_details.order_id,
        jenis: data_transaksi.jenis,
        program_id: data_transaksi.program_id,
        metode: data.payment_type,
        user_id: id,
        properties: data_transaksi.to_data,
        data_user: req.detailUser,
        status: result.transaction_status,
      });

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses create transaksi",
        data: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  createTransaksiFreeProgram: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { data_transaksi } = req.body;
      const orderid = generateNomorPembayaran();

      let bulan = data_transaksi.bulan;
      let validUntil = new Date();
      if (bulan > 0) {
        validUntil.setMonth(validUntil.getMonth() + bulan);
      }

      await transaksiModel.insert({
        bank: "FREEBANK",
        bank_response: {
          currency: "IDR",
          order_id: orderid,
          va_numbers: [
            {
              bank: "FREEBANK",
              va_number: "FREEBANK2025",
            },
          ],
          expiry_time: new Date(),
          merchant_id: "G776266591",
          status_code: "200",
          fraud_status: "accept",
          gross_amount: Number(data_transaksi.harga_akhir),
          payment_type: "WEB",
          signature_key: "2025",
          status_message: "Success, transaction is found",
          transaction_id: orderid,
          settlement_time: new Date(),
          transaction_time: new Date(),
          payment_amounts: [],
          transaction_type: "on-us",
          transaction_status: "settlement",
        },
        id: orderid,
        jenis: data_transaksi.jenis,
        program_id: data_transaksi.program_id,
        metode: "WEB",
        user_id: id,
        properties: data_transaksi,
        valid_until: validUntil,
        data_user: req.detailUser,
        status: "success",
      });

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses create transaksi",
        data: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  createTransaksi: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { data_transaksi, detail } = req.body;

      let payment_type =
        data_transaksi.name === "Mandiri"
          ? "echannel"
          : data_transaksi.name === "Permata"
            ? "permata"
            : "bank_transfer";

      let data = {
        payment_type,
        bank_transfer: {
          bank: data_transaksi.name.toLowerCase(),
        },
        item_details: [
          { ...data_transaksi, quantity: 1, price: data_transaksi.harga_akhir },
        ],
        transaction_details: {
          order_id: generateNomorPembayaran(),
          gross_amount: Number(data_transaksi.harga_akhir), // harus angka
        },
        customer_details: req.detailUser,
      };

      if (data_transaksi.name === "QRIS") {
        delete data.bank_transfer;
        data = {
          ...data,
          payment_type: "gopay",
        };
      }

      if (payment_type === "echannel") {
        data = {
          ...data,
          echannel: {
            bill_info1: "Payment",
            bill_info2: "Online purchase",
          },
        };
      }

      if (payment_type == "permata") {
        delete data.bank_transfer;
      }

      const serverKey = process.env.MIDTRANS_S_KEY; // ganti dengan server key
      const authString = Buffer.from(
        serverKey + ":" + process.env.MIDTRANS_S_PASS,
      ).toString("base64");

      const response = await fetch(process.env.URL_MIDTRANS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${authString}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      await transaksiModel.insert({
        bank: data_transaksi.name.toUpperCase(),
        bank_response: result,
        id: data.transaction_details.order_id,
        jenis: data_transaksi.jenis,
        program_id: data_transaksi.program_id,
        metode: data.payment_type,
        user_id: id,
        properties: data_transaksi,
        data_user: detail,
        status: result.transaction_status,
      });

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses create transaksi",
        data: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  createSnapTransaksi: async (req, res) => {
    try {
      const { data_transaksi, detail } = req.body;
      const order_id = generateNomorPembayaran();
      let parameter = {
        transaction_details: {
          order_id: order_id,
          gross_amount: Number(data_transaksi.harga_akhir),
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: detail.name || "-",
          last_name: "-",
          email: detail.email,
          phone: detail.no_wa,
        },
      };
      const transaction = await snap.createTransaction(parameter);
      await transaksiModel.insert({
        id: order_id,
        jenis: data_transaksi.jenis,
        program_id: data_transaksi.program_id,
        user_id: detail.id,
        properties: data_transaksi,
        data_user: detail,
        status: "pending",
      });

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Transaksi berhasil di buat",
        data: {
          token: transaction.token,
          redirect_url: transaction.redirect_url,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  createSnapTransaksiPembelian: async (req, res) => {
    try {
      const { data_transaksi, detail } = req.body;
      let parameter = {
        transaction_details: {
          order_id: data_transaksi.order_id,
          gross_amount: Number(data_transaksi.harga_akhir),
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: detail.name || "-",
          last_name: "-",
          email: detail.email,
          phone: detail.no_wa,
        },
      };
      const transaction = await snap.createTransaction(parameter);
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Berhasil generate pembayaran",
        data: {
          token: transaction.token,
          redirect_url: transaction.redirect_url,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  handleMidtransNotification: async (req, res) => {
    try {
      const notification = req.body;
      const {
        order_id,
        status_code,
        gross_amount,
        signature_key,
        transaction_status,
        fraud_status,
        payment_type,
      } = notification;

      /** 🔐 Validasi Signature */
      const serverKey = process.env.MIDTRANS_S_KEY;
      const payload = order_id + status_code + gross_amount + serverKey;
      const hash = crypto.createHash("sha512").update(payload).digest("hex");

      if (hash !== signature_key) {
        return res.status(403).json({ message: "Invalid signature" });
      }

      /** 🔎 Cari transaksi */
      const transaksi = await transaksiModel.findOne({
        where: { id: order_id },
      });

      if (!transaksi) {
        return res.status(404).json({ message: "Transaksi tidak ditemukan" });
      }

      /** 🔁 Idempotent */
      if (transaksi.status === "success") {
        return res.status(200).json({ message: "Already processed" });
      }

      const status = mapMidtransStatus(transaction_status, fraud_status);
      const paymentInfo = extractPaymentInfo(notification);

      let updateData = {
        status,
        payment_type,
        metode: payment_type,
        bank: paymentInfo.bank,
        channel: paymentInfo.channel,
        va_number: paymentInfo.va_number,
        store: paymentInfo.store,
        bank_response: notification,
        order_id: order_id,
      };

      /** ⏳ Valid until */
      if (status === "success" && transaksi.jenis === "Program Utama") {
        try {
          const props =
            typeof transaksi.properties === "string"
              ? JSON.parse(transaksi.properties)
              : transaksi.properties;

          const bulan = Number(props?.bulan) || 0;

          if (bulan > 0) {
            const validUntil = new Date();
            validUntil.setMonth(validUntil.getMonth() + bulan);
            updateData.valid_until = validUntil;
          }
        } catch (e) {
          console.error("Parse properties gagal", e);
        }
      }

      Object.assign(transaksi, updateData);
      await transaksiModel.save(transaksi);

      /** ✅ Hapus transaksi lain yang bukan success */
      if (status === "success") {
        await transaksiModel
          .createQueryBuilder()
          .delete()
          .where("user_id = :user_id", { user_id: transaksi.user_id })
          .andWhere("jenis = :jenis", { jenis: transaksi.jenis })
          .andWhere("program_id = :program_id", {
            program_id: transaksi.program_id,
          })
          .andWhere("status != :status", { status: "success" })
          .andWhere("id != :id", { id: transaksi.id })
          .execute();

        // ✅ Simpan ke redeem_code jika pakai referal
        try {
          // jsonb sudah jadi object langsung — tidak perlu JSON.parse
          const props = transaksi.properties;
          const voucherCode = props?.voucherCode;
          const tipe = props?.tipe;

          if (voucherCode && tipe === "REFERAL") {
            // Cari user pemilik kode referal
            const userPemilik = await userModel.findOne({
              where: { referal: voucherCode },
            });

            // Cari redeem_code by kode
            let redeemData = await redeemModel.findOne({
              where: { kode: voucherCode, is_deleted: false },
            });

            if (!redeemData) {
              // Belum ada — buat baru
              redeemData = redeemModel.create({
                kode: voucherCode,
                nama: userPemilik?.name || null,
                email: userPemilik?.email || null,
                detail_user: userPemilik || null,
                jumlah_total: 1,
                jumlah_pengajuan: 0,
                sisa: 0,
                status: "aktif",
                created_at: new Date(),
              });
            } else {
              // Sudah ada — increment
              redeemData.jumlah_total = (redeemData.jumlah_total || 0) + 1;
              redeemData.updated_at = new Date();
            }

            await redeemRepo.save(redeemData);
          }
        } catch (redeemErr) {
          console.error("Redeem code error:", redeemErr);
        }
      }
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Notification error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  updateTransaksi: async (req, res) => {
    try {
      const serverKey = process.env.MIDTRANS_S_KEY;
      const notification = req.body;

      const authString = Buffer.from(serverKey + ":").toString("base64");
      const verifyResponse = await fetch(
        process.env.URL_NOTIF + notification.order_id + "/status",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${authString}`,
          },
        },
      );
      const statusResponse = await verifyResponse.json();

      const { transaction_status, fraud_status, order_id } = statusResponse;

      const transaksiTable = await transaksiModel.findOne({
        where: { id: order_id },
      });

      let updateStatus;
      if (transaction_status === "capture") {
        if (fraud_status === "challenge") {
          updateStatus = "challenge";
        } else if (fraud_status === "accept") {
          updateStatus = "success";
        }
      } else if (transaction_status === "settlement") {
        updateStatus = "success";
      } else if (transaction_status === "pending") {
        updateStatus = "pending";
      } else if (
        transaction_status === "deny" ||
        transaction_status === "expire" ||
        transaction_status === "cancel"
      ) {
        updateStatus = "failed";
      }

      // Data default untuk update
      let updateData = {
        status: updateStatus,
        bank_response: statusResponse,
      };

      // Hitung valid_until kalau success dan jenis Program Utama
      if (
        updateStatus === "success" &&
        transaksiTable?.jenis === "Program Utama"
      ) {
        let bulan = 0;

        try {
          const props =
            typeof transaksiTable.properties === "string"
              ? JSON.parse(transaksiTable.properties)
              : transaksiTable.properties;

          bulan = Number(props?.bulan) || 0;
        } catch (err) {
          console.error("Gagal parse properties:", err);
        }

        if (bulan > 0) {
          const validUntil = new Date();
          validUntil.setMonth(validUntil.getMonth() + bulan);

          // simpan ke updateData
          updateData.valid_until = validUntil;
        }
      }

      // Update DB
      await transaksiModel.update({ id: order_id }, updateData);

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Notifikasi di update",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  getTransaksiUser: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { jenis, status } = req.query;

      // Query builder dasar
      let query = transaksiModel
        .createQueryBuilder("t")
        .select([
          "t.id",
          "t.user_id",
          "t.jenis",
          "t.program_id",
          "t.status",
          "t.created_at",
          "t.updated_at",
          "t.valid_until",
          "t.bank",
          "t.metode",
          "t.properties",
          "t.bank_response",
        ])
        .where("t.user_id = :id", { id })
        .andWhere("t.is_deleted = false");

      // filter jenis jika ada
      if (jenis) {
        query = query.andWhere("t.jenis = :jenis", { jenis });
      }

      // filter status jika ada
      if (status) {
        query = query.andWhere("t.status = :status", { status });
      }

      const result = await query.orderBy("t.created_at", "DESC").getMany();

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses get transaksi user",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  getTransaksiProgram: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { program_id } = req.params;
      const { jenis } = req.query;
      const result = await transaksiModel.findOne({
        where: {
          user_id: id,
          program_id,
          jenis,
        },
        order: {
          created_at: "DESC",
        },
      });

      if (!result) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Belum dibeli",
          data: null,
        });
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses get transaksi user",
        data: {
          isPurchase: result.status === "success" ? true : false,
          valid: result.valid_until,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  getTransaksiTO: async (req, res) => {
    try {
      const { id } = req.detailUser;
      const { program_id } = req.params;
      const { jenis } = req.query;
      const result = await transaksiModel.find({
        where: {
          user_id: id,
          program_id,
          jenis,
        },
        order: {
          created_at: "DESC",
        },
      });
      if (result.length < 1) {
        return res.status(404).json({
          status: 404,
          success: false,
          message: "Belum dibeli",
          data: null,
        });
      }
      let data;
      const dataPremium = result.find(
        (item) => item.bank !== "FREEBANK" && item.status == "success",
      );
      const dataFree = result.find((item) => item.bank == "FREEBANK");

      if (dataPremium) {
        data = dataPremium;
      } else {
        data = dataFree;
      }
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses get transaksi user",
        data: {
          isPurchase: data.status === "success" ? true : false,
          isFreeTO: data.bank === "FREEBANK" ? true : false,
          toStart: data?.properties?.properties?.startGratis || "-",
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  getAllTransaksiUser: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const page = parseInt(req.query.page) || 1;
      const offset = (page - 1) * limit;
      const search = req.query.search || "";
      const { jenis, status, tanggal } = req.query;

      // Query builder dasar
      let query = transaksiModel
        .createQueryBuilder("t")
        .select([
          "t.id",
          "t.user_id",
          "t.jenis",
          "t.program_id",
          "t.status",
          "t.created_at",
          "t.updated_at",
          "t.valid_until",
          "t.bank",
          "t.metode",
          "t.properties",
          "t.bank_response",
          "t.data_user",
        ])
        .where("t.is_deleted = false");

      // filter jenis jika ada
      if (jenis) {
        query = query.andWhere("t.jenis = :jenis", { jenis });
      }
      if (search) {
        query = query.andWhere("t.id::text ILIKE :search", {
          search: `%${search}%`,
        });
      }

      // filter status jika ada
      if (status) {
        query = query.andWhere("t.status = :status", { status });
      }
      if (tanggal) {
        query = query.andWhere("DATE(t.created_at) = :tanggal", { tanggal });
      }
      const [result, count] = await query
        .orderBy("t.created_at", "DESC")
        .take(limit)
        .skip(offset)
        .getManyAndCount();

      const totalPage = Math.ceil(count / limit);
      const nextPage = page < totalPage;
      const prevPage = page > 1;

      return res.status(200).json({
        status: 200,
        success: true,
        message: "Sukses load program",
        data: {
          nextPage: nextPage,
          prevPage: prevPage,
          page: page,
          totalPage: totalPage,
          totalData: count,
          data: result,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
  addPengajuanKode: async (req, res) => {
    try {
      await redeemModel.insert({
        email: req.body.email,
        jumlah_pengajuan: req.body.jumlah_pengajuan,
        jumlah_total: req.body.jumlah_total,
        kode: req.body.kode,
        nama: req.body.nama,
        sisa: req.body.sisa,
      });
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Berhasil mengajukan klaim",
        data: [],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: error.message,
      });
    }
  },
};

function generateNomorPembayaran() {
  const random = Math.floor(Math.random() * 1000000000); // angka random 9 digit
  const epoch = Math.floor(Date.now() / 1000); // timestamp detik
  return `0B${random}C${epoch}`;
}

function extractPaymentInfo(notification) {
  const { payment_type } = notification;

  let bank = null;
  let channel = payment_type;
  let va_number = null;
  let store = null;

  switch (payment_type) {
    case "credit_card":
      bank = notification.bank || notification.card_type;
      channel = "card";
      break;

    case "bank_transfer":
      channel = "va";

      if (notification.va_numbers?.length) {
        bank = notification.va_numbers[0].bank;
        va_number = notification.va_numbers[0].va_number;
      } else if (notification.permata_va_number) {
        bank = "permata";
        va_number = notification.permata_va_number;
      }
      break;

    case "echannel": // Mandiri bill
      bank = "mandiri";
      va_number = notification.bill_key;
      channel = "va";
      break;

    case "gopay":
    case "qris":
    case "akulaku":
      bank = notification.issuer || payment_type;
      channel = "ewallet";
      break;

    case "cstore":
      store = notification.store;
      channel = "cstore";
      break;

    default:
      bank = payment_type;
  }

  return { bank, channel, va_number, store };
}
function mapMidtransStatus(transaction_status, fraud_status) {
  if (transaction_status === "capture") {
    return fraud_status === "accept" ? "success" : "challenge";
  }

  const map = {
    settlement: "success",
    pending: "pending",
    deny: "failed",
    cancel: "failed",
    expire: "failed",
  };

  return map[transaction_status] || "pending";
}
