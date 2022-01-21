import ImgurClient from 'imgur';
import { IMGUR_API, FIREBASE_API } from '../config';

const client = new ImgurClient(IMGUR_API);

export default client;