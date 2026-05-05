import axios from "../axios";

export const createKelasOnline = async (body, token) => {
  const response = await axios.post("/kelas/create", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export async function getKelasOnline(
  page,
  limit,
  search,
  sortBy,
  programUtama
) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (sortBy) query.append("sortby", sortBy);
  if (programUtama) query.append("programUtama", programUtama);
  const response = await axios.get(`/kelas/get?${query.toString()}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  return response.data;
}
export async function adminKelasOnline(
  page,
  limit,
  search,
  sortBy,
  programUtama,
  token
) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (sortBy) query.append("sortby", sortBy);
  if (programUtama) query.append("programUtama", programUtama);
  const response = await axios.get(`/kelas/admin-get?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  return response.data;
}
export const updateKelasOnline = async (id, body, token) => {
  const response = await axios.post(`/kelas/update/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteKelasOnline = async (id, token) => {
  const response = await axios.post(
    `/kelas/delete/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
