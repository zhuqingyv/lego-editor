import Http from "./http";
import config from './config';

const http = new Http({ baseUrl: 'http://localhost:5711' });
config.forEach((item) => http.use(item));

export default http;