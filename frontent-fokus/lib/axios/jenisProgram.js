import axios from "../axios";

export const createJenisProgram = async (body, token) => {
  const response = await axios.post("/jenis-program/create", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const updateJenisProgram = async (id, body, token) => {
  //  //  console.log(body)
  const response = await axios.post(`/jenis-program/update/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const getListJenisProgram = async (params) => {
  const response = await axios.get(`/jenis-program/list`, {
    params: params || {},
  });
  return response.data;
};
export const getListJenisKelas = async (params) => {
  const response = await axios.get(`/jenis-program/list`, {
    params: params || {},
  });
  return response.data;
};
export const getListJenisTo = async (params) => {
  const response = await axios.get(`/jenis-program/list`, {
    params: params || {},
  });
  return response.data;
};
export const deleteJenisProgram = async (id, token) => {
  const response = await axios.post(
    `/jenis-program/delete/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
