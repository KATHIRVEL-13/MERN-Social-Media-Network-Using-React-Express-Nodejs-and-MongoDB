import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://mern_backend_1:5000',
    
});

export default instance;
