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
    deleteFuncionario: async (id) => {
        return axios.delete(`${apiUrl}funcionarios/${id}`);
    },
    updateFuncionario: async (payload) => {
        return axios.put(`${apiUrl}funcionarios/`, payload);
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
    getOcorrenciasByCondominioId: async (codigo_condominio) => {
        return axios.get(`${apiUrl}ocorrencias/${codigo_condominio}`);
    },
    registerOcorrencia: async (payload) => {
        return axios.post(`${apiUrl}ocorrencias/`, payload);
    },
    updateOcorrencia: async (payload) => {
        return axios.put(`${apiUrl}ocorrencias/`, payload);
    },
    deleteOcorrencia: async (id) => {
        return axios.delete(`${apiUrl}ocorrencias/${id}`);
    },
    getReservasByCondominioId: async (codigo_condominio) => {
        return axios.get(`${apiUrl}reservas/${codigo_condominio}`);
    },
    registerReserva: async (payload) => {
        return axios.post(`${apiUrl}reservas/`, payload);
    },
    updateReserva: async (payload) => {
        return axios.put(`${apiUrl}reservas/`, payload);
    },
    deleteReserva: async (id) => {
        return axios.delete(`${apiUrl}reservas/${id}`);
    },
    
}

export default api;