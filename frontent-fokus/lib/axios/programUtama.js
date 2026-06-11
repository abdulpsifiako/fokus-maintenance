import axios from "../axios";

export const createProgramUtama = async (form, token) => {
  const response = await axios.post("/program-utama/create", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export async function getProgramUtama(
  page,
  limit,
  search,
  sortBy,
  status,
  jenis,
) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (sortBy) query.append("sortby", sortBy);
  if (status) query.append("status", status);
  if (jenis) query.append("jenis", jenis);

  const response = await axios.get(`/program-utama/get?${query.toString()}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  return response.data;
}
export async function getProgramUtamaAdmin(
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

  const response = await axios.get(
    `/program-utama/admin-get?${query.toString()}`,
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
}
export const updateProgramUtama = async (id, form, token) => {
  const response = await axios.post(`/program-utama/update/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const deleteProgramUtama = async (id, token) => {
  const response = await axios.post(
    `/program-utama/delete/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
export const laporSoalUpdate = async (id, form, token) => {
  const response = await axios.post(`/program-utama/status-lapor/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getListProgramUtamaVideo = async (token) => {
  const response = await axios.get(`/program-utama/list-video`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const createVideoProgramUtama = async (data, token) => {
  const response = await axios.post(`/video/create`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export async function uploadFileProgramUtama(
  formData,
  token,
  { onProgress } = {},
) {
  const response = await axios.post("/landing/upload-file", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    timeout: 0,
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );

        const loadedMB = (progressEvent.loaded / (1024 * 1024)).toFixed(1);
        const totalMB = (progressEvent.total / (1024 * 1024)).toFixed(1);

        if (onProgress) {
          onProgress({
            percent,
            uploaded: `${loadedMB} MB / ${totalMB} MB`,
          });
        }
      }
    },
  });
  return response.data;
}

export async function getVideoProgramUtama(page, limit, search, sortBy, token) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (sortBy) query.append("sortby", sortBy);

  const response = await axios.get(`/video/list?${query.toString()}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export const updateVideoProgramUtama = async (id, form, token) => {
  const response = await axios.post(`/video/update/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const deleteVideoProgramUtama = async (id, token) => {
  const response = await axios.post(
    `/video/v-delete/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const getListProgramUtamaLatihan = async (token) => {
  const response = await axios.get(`/video/list-latihan`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response.data;
};

export const getListMateri = async (id, token) => {
  const response = await axios.get(`/program-utama/list-materi-latihan/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response.data;
};
export const getListSubMateri = async (id, token) => {
  const response = await axios.get(
    `/program-utama/list-submateri-latihan/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
  );
  return response.data;
};

export const createLatihanProgram = async (form, token) => {
  const response = await axios.post(`/program-utama/create-latihan`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const updateLatihanProgram = async (id, form, token) => {
  const response = await axios.post(
    `/program-utama/update-latihan/${id}`,
    form,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const deleteLatihanProgramUtama = async (id, token) => {
  const response = await axios.post(
    `/program-utama/delete-latihan/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const createJawabanUser = async (form, token) => {
  const response = await axios.post(`/program-utama/save-answer`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getPembahasan = async (form, token) => {
  const response = await axios.post(`/program-utama/get-pembahasan`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const getPembahasanById = async (form, token) => {
  const response = await axios.post(
    `/program-utama/get-pembahasan-by-id`,
    form,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
export const getRapor = async (form, token) => {
  const response = await axios.post(`/program-utama/get-rapor`, form, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const getRankingTO = async (form, token) => {
  const response = await axios.post(`/program-utama/get-ranking`, form, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const getHistory = async (form, token) => {
  const response = await axios.post(`/history/get`, form, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const createHistory = async (form, token) => {
  const response = await axios.post(`/history/create`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const laporkanSoal = async (form, token) => {
  const response = await axios.post(`/program-utama/laporkan-soal`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const getCountProgramUtama = async (token, program_utama) => {
  const response = await axios.post(
    `/program-utama/count`,
    {
      program_utama: program_utama,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
export const getCountMyLatihan = async (token) => {
  const response = await axios.get(`/program-utama/latihan-mycount`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export async function getListLatihanProgramUtama(
  page,
  limit,
  search,
  sortBy,
  token,
  programUtama,
) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (sortBy) query.append("sortby", sortBy);
  if (programUtama) query.append("programUtama", programUtama);
  const response = await axios.get(
    `/program-utama/list-latihan?${query.toString()}`,
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
}
export async function getListLaporan(page, limit, search, sortBy, token) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (sortBy) query.append("sortby", sortBy);
  const response = await axios.get(
    `/program-utama/laporan?${query.toString()}`,
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
}

export const getProgramUtamaByID = async (id) => {
  const response = await axios.get(`/program-utama/get-one/${id}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response.data;
};
export const getProgramku = async (jenis, token) => {
  const query = new URLSearchParams();
  if (jenis) query.append("jenis", jenis);
  const response = await axios.get(
    `/program-utama/programku?${query.toString()}`,
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

export const getVideoByIdDetail = async (id) => {
  const response = await axios.get(`/video/v-id/${id}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response.data;
};
export const getLatihanByIdDetail = async (id) => {
  const response = await axios.get(`/video/l-id/${id}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
  return response.data;
};
