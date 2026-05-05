import axios from '../axios'

export async function daftar(data){
    const response = await axios.post('/auth/daftar', data)
    return response.data;
}

export async function konfirmasiEmail(body) {
    const response = await axios.post('/auth/konfirmasi-email', body)
    return response.data;
}
export async function addUserProgram(body, params) {
    const response = await axios.post('/auth/tambah-user', body,
        {
          headers: {
            Authorization: `Bearer ${params}`,
          }  
        }
    )
    return response.data;
}

export async function login(body) {
    const response = await axios.post('/auth/login', body)
    return response.data;
}

export async function session(params) {
     const response = await axios.get('/auth/session', {
            headers: {
            Authorization: `Bearer ${params}`,
            }
        }
    )
    return response.data;
}

export async function exitApp(params) {
    const response = await axios.get(
        '/auth/keluar',
        {
          headers: {
            Authorization: `Bearer ${params}`,
          }  
        }
    )
    return response.data;
}

export async function sentMailForgotPassword(params) {
    const response = await axios.post('/user/sentmail',params)
    return response.data
}
export async function updatePassword(params) {
    const response = await axios.post('/user/password',params)
    return response.data
}