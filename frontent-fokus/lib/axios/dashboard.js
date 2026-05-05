import axios from '../axios'

export async function getCountUsers(params) {
    const response = await axios.get('/dashboard/count',{
            headers: {
            Authorization: `Bearer ${params}`,
            }
        }
    )
    return response.data.data[0];
}
export async function getSetting(params) {
    const response = await axios.get('/dashboard/setting',{
            headers: {
            Authorization: `Bearer ${params}`,
            }
        }
    )
    return response.data;
}
export async function updateSetting(form, params) {
    const response = await axios.post('/dashboard/update/setting',form,{
            headers: {
            Authorization: `Bearer ${params}`,
            }
        }
    )
    return response.data;
}
export async function getCountPengunjung(params) {
    const response = await axios.get('/dashboard/count-pengunjung',{
            headers: {
            Authorization: `Bearer ${params}`,
            }
        }
    )
    return response.data.data[0];
}
export async function getCountTransaksi(params) {
    const response = await axios.get('/dashboard/count-transaksi',{
            headers: {
            Authorization: `Bearer ${params}`,
            }
        }
    )
    return response.data;
}

export async function getAllUser(page, limit, search, params, sortBy) {
    const query = new URLSearchParams()
    if(search) query.append("search", search)
    if(page) query.append("page", page)
    if(limit) query.append("limit", limit)
    if(sortBy) query.append('sortby', sortBy)
    
    const response = await axios.get(`/dashboard/user-and-count?${query.toString()}`,
        {
            headers: {
            Authorization: `Bearer ${params}`,
            }
        }
    )

    return response.data
}