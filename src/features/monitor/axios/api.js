import axios from 'axios';

export function apiLongin(username, password) {
  return axios.post('http://localhost:8080/login', { username: username, password: password });
}
