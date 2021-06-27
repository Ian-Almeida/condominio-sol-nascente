const axios = require('axios');

const apiUrl = 'http://localhost:3001/api/'

const api = {
    login: async (payload) => {
        return axios.post(`${apiUrl}usuarios/login/`, payload);
    },
    getCondominios: async () => {
        return axios.get(`${apiUrl}condominios/`);
    },
    getCondominioByUserId: async (userId) => {
        return axios.get(`${apiUrl}condominios/${userId}/`);
    },
    registerCondominio: async (payload) => {
        return axios.post(`${apiUrl}condominios/`, payload); 
    },
    updateCondominio: async (payload) => {
        return axios.put(`${apiUrl}condominios/`, payload); 
    },
    deleteCondominio: async (id) => {
        return axios.delete(`${apiUrl}condominios/${id}`);
    },
    registerUser: async (payload) => {
        return axios.post(`${apiUrl}usuarios/signup/`, payload); 
    },
    getFuncionariosByCondominioId: async (condominioId) => {
        return axios.get(`${apiUrl}funcionarios/${condominioId}/`);
    },
    registerAchadosPerdidos: async (payload) => {
        return axios.post(`${apiUrl}achadosPerdidos/`, payload); 
    },
    getAllAchadosPerdidos: async () => {
        return axios.get(`${apiUrl}achadosPerdidos/`);
    },
    getAchadosPerdidosByCondominioId: async (condominioId) => {
        return axios.get(`${apiUrl}achadosPerdidos/${condominioId}`);
    },
    updateAchadosPerdidosObject: async (payload) => {
        return axios.put(`${apiUrl}achadosPerdidos/`, payload);
    },
    deleteAchadosPerdidosObject: async (id) => {
        return axios.delete(`${apiUrl}achadosPerdidos/${id}`);
    },
    
}

export default api;