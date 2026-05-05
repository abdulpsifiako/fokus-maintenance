import axios from '../axios'

export async function getDetail(params) {
    const response = await axios.get('/user/detail',{
            headers: {
            Authorization: `Bearer ${params}`,
            }
        }
    )
    return response.data.data[0].detail;
}

export async function getProvinsi() {
    const response = await axios.get('',{
        baseURL: `${process.env.NEXT_PUBLIC_API_WILAYAH}/api/provinces.json`,
    })
    return response.data;
}
export async function getKabKota(params) {
    const response = await axios.get('',{
        baseURL: `${process.env.NEXT_PUBLIC_API_WILAYAH}/api/regencies/${params}.json`,
    })
    return response.data;
}

export async function getAvailableUsername(params, token) {
    const response = await axios.post('/user/user-available', {username:params}, {
        headers: {
            Authorization: `Bearer ${token}`,
        } 
    });

    return response.data;
}
export async function updateUserProfile(body, token) {
    const response = await axios.post('/user/user-update', body, {
        headers: {
            Authorization: `Bearer ${token}`,
        } 
    });

    return response.data;
}
export async function updatePIN(params, token) {
    const response = await axios.post('/user/user-pin', {pin:params}, {
        headers: {
            Authorization: `Bearer ${token}`,
        } 
    });

    return response.data;
}
export async function cekOTP(params) {
    const response = await axios.post('/user/otp', params);
    return response.data;
}
