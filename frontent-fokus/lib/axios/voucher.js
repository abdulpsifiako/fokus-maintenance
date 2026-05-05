import axios from "../axios"

export const createVoucher = async (form, token) => {
    const response = await axios.post('/voucher/create', form, {
        headers: {
            Authorization: `Bearer ${token}`,
            }
    })
    return response.data
}
export const updateVoucher = async (form, token) => {
    const response = await axios.post('/voucher/update', form, {
        headers: {
            Authorization: `Bearer ${token}`,
            }
    })
    return response.data
}
export const deleteVoucher = async (form, token) => {
    const response = await axios.post('/voucher/delete', form, {
        headers: {
            Authorization: `Bearer ${token}`,
            }
    })
    return response.data
}

export async function getListVoucher(page, limit, search, sortBy, token) {
    
    const query = new URLSearchParams()
    if(search) query.append("search", search)
    if(page) query.append("page", page)
    if(limit) query.append("limit", limit)
    if(sortBy) query.append('sortby', sortBy)

    const response = await axios.get(`/voucher/all?${query.toString()}`,
        {
            headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0",
             Authorization: `Bearer ${token}`,
            }
        }
    )

    return response.data
}
export async function getListPengajuan(page, limit, search, sortBy, token) {
    
    const query = new URLSearchParams()
    if(search) query.append("search", search)
    if(page) query.append("page", page)
    if(limit) query.append("limit", limit)
    if(sortBy) query.append('sortby', sortBy)

    const response = await axios.get(`/voucher/pengajuan?${query.toString()}`,
        {
            headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0",
             Authorization: `Bearer ${token}`,
            }
        }
    )

    return response.data
}

export async function updateStatusPengajuan(id, status, token) {
  const res = await axios.post(`/voucher/pengajuan/${id}/status`, 
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}