import axios from "../axios";
export const createProgram = async (form, token) => {
  const response = await axios.post("/program", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const updateProgram = async (id, form, token) => {
  const response = await axios.post(`/program/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export async function getProgram(page, limit, search, sortBy, is_active) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (sortBy) query.append("sortby", sortBy);
  if (is_active) query.append("is_active", is_active);

  const response = await axios.get(`/program/get?${query.toString()}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  return response.data;
}
export async function getProgramLanding(
  page,
  limit,
  search,
  sortBy,
  is_active
) {
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (page) query.append("page", page);
  if (limit) query.append("limit", limit);
  if (sortBy) query.append("sortby", sortBy);
  if (is_active) query.append("is_active", is_active);

  const response = await axios.get(`/program/landing?${query.toString()}`, {
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      Expires: "0",
    },
  });

  return response.data;
}
export async function deleteProgram(id, token) {
  const response = await axios.post(
    `/program/delete/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}
