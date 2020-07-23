import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-fbfc8.firebaseio.com/'
});

export default instance;