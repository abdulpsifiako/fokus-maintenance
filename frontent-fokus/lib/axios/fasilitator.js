import axios from '../axios'

export const createFasilitator = async (body, token) => {
    const response = await axios.post('/fasilitator/create', body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },          
    });
    return response.data;
}
export async function getAllFasilitator(page, limit, search, sortBy) {
    
    const query = new URLSearchParams()
    if(search) query.append("search", search)
    if(page) query.append("page", page)
    if(limit) query.append("limit", limit)
    if(sortBy) query.append('sortby', sortBy)
    
    const response = await axios.get(`/fasilitator/get?${query.toString()}`,
        {
            headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Expires": "0",
            }
        }
    )

    return response.data
}
export const updateFasilitator = async (id, body, token) => {
    const response = await axios.post(`/fasilitator/update/${id}`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}
export const updateStatusFasilitator = async (id, body, token) => {
    const response = await axios.post(`/fasilitator/update-status/${id}`, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

export const deleteFasilitator =async (id, token) => {
    const response = await axios.post(`/fasilitator/delete/${id}`,{},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }
    );
    return response.data;
}