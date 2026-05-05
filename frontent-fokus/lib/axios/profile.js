import axios from "../axios";

export async function updateProfile(body, token) {
    const response = await axios.post('/profile/update-profile',body,{
            headers: {
            Authorization: `Bearer ${token}`,
            }
        }
    )
    return response.data;
}

export async function uploadFileUser(formData, token) {
    const response = await axios.post('/profile/upload-file',formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        })
    return response.data;
}