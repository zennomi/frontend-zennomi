import axios from 'axios';
// config
import { HOST_API } from '../config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('firebase-token');
  config.headers.Authorization = token ? token : '';
  return config;
}
);

const updateTitle = (title) => {
  return axiosInstance({
    method: 'post',
    url: `/v1/titles/${title._id}`,
    data: title,
  })
}

export default axiosInstance;
export { updateTitle };