import axios from 'axios';
// config
import { CORS_HOST_API } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({

});

axiosInstance.interceptors.request.use(function (config) {
    const encodedURL = btoa(config.url).replace(/\+/g, "-").replace(/\//g, "_");
    config.url = `${CORS_HOST_API}/v1/cors/${(encodedURL)}?source=proxy_cubari_moe`;
    config.headers = {
        'Referrer-Policy': 'same-origin',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'x-requested-with': 'cubari',
    };
    return config;
}
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(error.response);
        return Promise.reject((error.response && error.response.data && (error.response.data.message || error.response.data || error.response)) || 'Something went wrong')
    }
);

export default axiosInstance;