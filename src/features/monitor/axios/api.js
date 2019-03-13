import axios from 'axios';
import { logout } from '../redux/actions';
let baseUrl = 'http://192.168.0.200:8080/imageserver';

let imageUrl = 'http://localhost:7070';
let option = {
  baseURL: baseUrl,
  timeout: 5000,
  crossdomain: true,
  withCredentials: true,
};
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://212.64.74.113/api';
  imageUrl = 'http://212.64.74.113';
  option = { ...option, crossdomain: false, baseURL: baseUrl };
}

export const URL = imageUrl;

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  crossdomain: true,
  withCredentials: true,
});
instance.interceptors.response.use(res => {
  if (res.data.status === 500) {
    logout();
    window.location.href = '/monitor/login';
    return;
  } else {
    return res;
  }
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

export function apiResetPassword(args = {}) {
  return instance.put(`/password?password=${args.password}&newPassword=${args.newPassword}`);
}

export function apiCreateStepUser(args = {}) {
  return instance.post(baseUrl + '/user/step', {
    username: args.username,
    title: args.title,
    projectId: args.projectId,
    projectName: args.projectName,
  });
}
export function apiIfUserNameExist(args = {}) {
  return instance.get(`${baseUrl}/user/check?username=${args.username}`);
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

export function apiGetAvailableProjects(args = {}) {
  return instance.get(baseUrl + '/project/all');
}

export function apiGetAvailableProjectsSize(args = {}) {
  return instance.get(baseUrl + '/project/size');
}

export function apiGetAvailableProjectIssues(args = {}) {
  if (!args.current) {
    args = { ...args, current: 1 };
  }
  if (!args.pageSize) {
    args = { ...args, pageSize: 10 };
  }
  if (!args.total) {
    args = { ...args, current: 1 };
  }
  if (!args.defaultCurrent) {
    args = { ...args, defaultCurrent: 1 };
  }
  const projectId = args.projectId;
  const url = baseUrl + '/project/' + projectId + '/issues';
  return instance.post(url, {
    current: args.current,
    pageSize: args.pageSize,
    total: args.total,
    defaultCurrent: args.defaultCurrent,
  });
}

export function apiGetAvailableProjectIssuesSize(args = {}) {
  const projectId = args.projectId;
  const url = baseUrl + '/project/' + projectId + '/issues/size';
  return instance.get(url);
}

export function apiFetchProjectList(args = {}) {
  return instance.get(`${baseUrl}/projects?page=${args.page}&pageSize=${args.pageSize}`);
}

export function apiFetchProject(args = {}) {
  return instance.get(`${baseUrl}/projects/${args.projectId}`);
}

export function apiFetchIssueList(args = {}) {
  return instance.get(
    `${baseUrl}/issues?projectId=${args.projectId}&page=${args.page}&pageSize=${
      args.pageSize
    }&keyword=${args.keyword}&dimension=${args.dimension}`,
  );
}
