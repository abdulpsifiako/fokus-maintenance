import axios from "../axios";

export const createJenisTo = async (body, token) => {
  const response = await axios.post("/jenis-to/create", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const updateJenisTo = async (id, body, token) => {
  //  //  console.log(body)
  const response = await axios.post(`/jenis-to/update/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const getListJenisTo = async (params) => {
  const response = await axios.get(`/jenis-to/list`, {
    params: params || {},
  });
  return response.data;
};
export const deleteJenisTo = async (id, token) => {
  const response = await axios.post(
    `/jenis-to/delete/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
