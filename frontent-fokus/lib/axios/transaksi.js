import axios from "../axios";

export const createTransaksi = async (form, token) => {
  const response = await axios.post("/transaksi/create", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const createSnapTransaksi = async (form, token) => {
  const response = await axios.post("/transaksi/create-snap", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const createSnapTransaksiPembelian = async (form, token) => {
  const response = await axios.post("/transaksi/create-snap-pembelian", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const createTransaksiFreeProgram = async (form, token) => {
  const response = await axios.post("/transaksi/create-free-program", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const createTransaksiFreeKelas = async (form, token) => {
  const response = await axios.post("/transaksi/create-free-kelas", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const cekVoucher = async (form, token) => {
  const response = await axios.post("/voucher/cek", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const cekReferal = async (voucherCode, token) => {
  const response = await axios.get(`/voucher/stats/${voucherCode}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
// export const cekReferal = async (voucherCode, token) => {
//     const response = await axios.get(`/voucher/referal/${voucherCode}`,{
//         headers: {
//             Authorization: `Bearer ${token}`,
//         }
//     })
//     return response.data
// }

export const addPengajuan = async (form, token) => {
  const response = await axios.post(`/voucher/ajukan`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export async function getTransaksi(status, jenis, token) {
  const query = new URLSearchParams();
  if (status) query.append("status", status);
  if (jenis) query.append("jenis", jenis);

  const response = await axios.get(`/transaksi/get-user/?${query.toString()}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export const getTransaksiPembelian = async (program_id, token, jenis) => {
  const response = await axios.get(
    `/transaksi/puscashed/${program_id}?jenis=${jenis}`,
    {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export async function getAllTransaksi(
  page,
  limit,
  search,
  token,
  jenis,
  tanggal,
  status
) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (jenis) query.append("jenis", jenis);
  if (tanggal) query.append("tanggal", tanggal);
  if (status) query.append("status", status);
  const response = await axios.get(`/transaksi/semua?${query.toString()}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
