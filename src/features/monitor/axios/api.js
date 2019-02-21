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
  withCredentials: true,
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

export function apiGetAvailableTitle(args = {}) {
  return instance.get(baseUrl + '/role/under');
}

export function apiCreateUser(args = {}) {
  return instance.post(baseUrl + '/user', {
    username: args.username,
    title: args.title,
  });
}

export function apiCreateProject(args = {}) {
  return instance.post(baseUrl + '/project', {
    name: args.name,
    startTime: args.startTime,
    endTime: args.endTime,
    overview: args.overview,
    location: args.location,
    designUnit: args.designUnit,
    monitorUnit: args.monitorUnit,
    constructionUnit: args.constructionUnit,
  });
}
