import axios from 'axios';

const api = axios.create({
    baseURL:"https://dummyjson.com",
    headers: {'Content-Type': 'application/json'},
    timeout: 10000,
})

export function setAuthToken(token)
{
    (token)? api.defaults.headers.common['Auther'] = `Bearer ${token}`: delete api.defaults.headers.common['Auther'];
}

export default api;