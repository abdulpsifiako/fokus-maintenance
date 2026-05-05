import axios from "../axios";

export const createJenisKelas = async (body, token) => {
  const response = await axios.post("/jenis-kelas/create", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const updateJenisKelas = async (id, body, token) => {
  //  //  console.log(body)
  const response = await axios.post(`/jenis-kelas/update/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const getListJenisKelas = async (params) => {
  const response = await axios.get(`/jenis-kelas/list`, {
    params: params || {},
  });
  return response.data;
};
export const deleteJenisKelas = async (id, token) => {
  const response = await axios.post(
    `/jenis-kelas/delete/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
