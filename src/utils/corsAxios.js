import axios from 'axios';
// config
import { HOST_API } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({

});

axiosInstance.interceptors.request.use(function (config) {
    const encodedURL = btoa(config.url).replace(/\+/g, "-").replace(/\//g, "_");
    config.url = `${HOST_API}/v1/cors/${(encodedURL)}`;
    config.headers = {
        'Referrer-Policy': 'same-origin',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
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