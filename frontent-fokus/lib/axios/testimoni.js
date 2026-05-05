import axios from '../axios'
export async function createTestimoni(body, token) {
    const response = await axios.post('/testimoni/create',body,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    return response.data;
}

export async function getAllTestimoni(page, limit, search, params, sortBy) {
    const query = new URLSearchParams()
    if(search) query.append("search", search)
    if(page) query.append("page", page)
    if(limit) query.append("limit", limit)
    if(sortBy) query.append('sortby', sortBy)
    
    const response = await axios.get(`/testimoni/user?${query.toString()}`,
        {
            headers: {
            Authorization: `Bearer ${params}`,
            }
        }
    )

    return response.data
}

export async function getImageUserData(id) {
    const response = await axios.get(`/testimoni/image/${id}`)
    return response.data;
}
export async function updateStatusTestimoni(id, body, token) {
    const response = await axios.post(`/testimoni/update-status/${id}`,body,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    return response.data;
}
export async function deleteTestimoni(id, token) {
    const response = await axios.post(`/testimoni/delete-testimoni/${id}`,{},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    return response.data;
}

export async function updateTestimoni(id, body, token) {
    const response = await axios.post(`/testimoni/update-testimoni/${id}`,body,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    return response.data;
}

export async function getAllTestimoniUser(page, limit, search, params, sortBy) {
    const query = new URLSearchParams()
    if(search) query.append("search", search)
    if(page) query.append("page", page)
    if(limit) query.append("limit", limit)
    if(sortBy) query.append('sortby', sortBy)
    
    const response = await axios.get(`/testimoni/user-all?${query.toString()}`,
        {
            headers: {
            Authorization: `Bearer ${params}`,
            }
        }
    )

    return response.data
}