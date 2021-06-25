const axios = require('axios');

const apiUrl = 'http://localhost:3001/api/'

const api = {
    login: async (payload) => {
        return axios.post(`${apiUrl}usuarios/login`, payload);
    },
    getCondominios: async () => {
        return axios.get(`${apiUrl}condominios/`);
    },
    registerUser: async (payload) => {
        return axios.post(`${apiUrl}usuarios/signup`, payload); 
    },
}

export default api;