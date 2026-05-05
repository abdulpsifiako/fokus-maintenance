import axios from "../axios";

// export const createProgramUtama = async (form, token) => {
//     const response = await axios.post('/program-utama/create',form,{
//         headers: {
//             Authorization: `Bearer ${token}`,
//         }
//     })
//     return response.data
// }
export async function getTryout(page, limit, search, sortBy, status, jenis) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (sortBy) query.append("sortby", sortBy);
  if (status) query.append("status", status);
  if (jenis) query.append("jenis", jenis);

  const response = await axios.get(`/tryout/get?${query.toString()}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  return response.data;
}
export async function adminTryout(
  page,
  limit,
  search,
  sortBy,
  status,
  jenis,
  token,
) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (sortBy) query.append("sortby", sortBy);
  if (status) query.append("status", status);
  if (jenis) query.append("jenis", jenis);

  const response = await axios.get(`/tryout/admin-get?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  return response.data;
}
export const createTryOut = async (form, token) => {
  const response = await axios.post(`/tryout/create`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const updateTryOut = async (id, form, token) => {
  const response = await axios.post(`/tryout/update/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const deleteTryOut = async (id, token) => {
  const response = await axios.post(
    `/tryout/delete/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
export const freeTryout = async (form, token) => {
  const response = await axios.post(`/transaksi/create-free-to`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const freeTOPremium = async (form, token) => {
  const response = await axios.post(`/transaksi/create-to-rp-nol`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const cekTryout = async (program_id, token, jenis) => {
  const response = await axios.get(
    `/transaksi/puscashed/to/${program_id}?jenis=${jenis}`,
    {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export async function downloadNilaiTryoutXLSX(tryout_id, token) {
  const response = await axios.get(`/tryout/tryout-nilai/${tryout_id}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob",
  });
  return response;
}
