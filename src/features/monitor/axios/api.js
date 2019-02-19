import axios from 'axios';
let baseUrl = 'http://localhost:8080';
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://212.64.74.113/imageserver';
}

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  // headers: {
  //   'Access-Control-Allow-Origin': '*',
  //   'Content-Type': 'application/json',
  // },
  crossdomain: true,
});
export function apiLongin(args = {}) {
  return instance.post(baseUrl + '/login', {
    username: args.username,
    password: args.password,
  });
}

export function apiLogout(args = {}) {
  return instance.get(baseUrl + '/logout');
}
