import axios from '../axios'

export async function updateUser(body, token) {
    const response = await axios.post('/management-user/update-user',body,{
            headers: {
            Authorization: `Bearer ${token}`,
            }
        }
    )
    return response.data;
}
export async function deleteuser(body, token) {
    const response = await axios.post('/management-user/delete-user',body,{
            headers: {
            Authorization: `Bearer ${token}`,
            }
        }
    )
    return response.data;
}