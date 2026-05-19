import axios from "../axios";

export async function addTermsCondition(body, token) {
  const response = await axios.post("/landing/term-condition", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export async function getTermsCondition() {
  const response = await axios.get("/landing/get-term-condition");
  return response.data;
}
export async function addKenaliKami(body, token) {
  const response = await axios.post("/landing/kenali-kami", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export async function getKenaliKami() {
  const response = await axios.get("/landing/get-kenali-kami", {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response.data;
}
export async function addKebijakanPrivacy(body, token) {
  const response = await axios.post("/landing/kebijakan-privacy", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export async function getKebijakanPrivacy() {
  const response = await axios.get("/landing/get-kebijakan-privacy");
  return response.data;
}

export async function uploadFile(formData, token) {
  const response = await axios.post("/landing/upload-file", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function addBannerImage(body, token) {
  const response = await axios.post("/landing/banner", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export async function getImgBanner() {
  const response = await axios.get("/landing/img-banner");
  return response.data;
}
export async function addInstagramPost(body, token) {
  const response = await axios.post("/landing/instagram", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
export async function addPengalamanPost(body, token) {
  const response = await axios.post("/landing/pengalaman", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getAllPengalaman({ page = 1, limit = 10, search = "" }) {
  const query = new URLSearchParams();

  if (search) query.append("search", search);
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  const response = await axios.get(
    `/landing/pengalaman/all?${query.toString()}`,
  );
  return response.data.data;
}

export const updatePengalaman = async (id, body, token) => {
  const response = await axios.post(`/landing/update/pengalaman/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export async function updatePengalamanStatus(id, is_active, token) {
  const response = await axios.post(
    `/landing/update/pengalaman/status/${id}`,
    { is_active },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}
export async function deletePengalaman(id, token) {
  const response = await axios.delete(`/landing/pengalaman/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function getInstagramPosts() {
  const response = await axios.get("/landing/instagram-post");
  return response.data;
}
export async function getPengalamanPost() {
  const response = await axios.get("/landing/pengalaman");
  return response.data;
}

// Admin — tambah info baru
export async function addInfo(body, token) {
  const response = await axios.post("/landing/info/add", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// Landing page — ambil 1 info terakhir (tanpa token)
export async function getLatestInfo() {
  const response = await axios.get("/landing/info/latest");
  return response.data;
}

// lib/axios/info.js
export async function updateInfoStatus(body, token) {
  const response = await axios.patch("/landing/info/status", body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
