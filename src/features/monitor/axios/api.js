import axios from 'axios';
import { saveReLogin } from '../../../common/sessionStorage';
// let baseUrl = 'http://192.168.0.200:8080/imageserver';
// let baseUrl = 'http://localhost:8080';
let baseUrl = 'http://192.168.0.200:8080/imageserver';

let imageUrl = 'http://192.168.0.200:9000/resources';
let option = {
  baseURL: baseUrl,
  timeout: 5000,
  crossdomain: true,
  withCredentials: true,
};
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://212.64.74.113/api';
  imageUrl = 'http://212.64.74.113/resources';
  option = { ...option, crossdomain: true, baseURL: baseUrl };
}

export const URL = imageUrl;

const instance = axios.create(option);
instance.interceptors.response.use(res => {
  if (res.data.status === 500) {
    saveReLogin(true);
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
export function apiUserBlock(args = {}) {
  return instance.put(`${baseUrl}/user/block?username=${args.username}`);
}
export function apiUserUnBlock(args = {}) {
  return instance.put(`${baseUrl}/user/unblock?username=${args.username}`);
}

export function apiUserDelete(args = {}) {
  return instance.put(`${baseUrl}/user/delete?username=${args.username}`);
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
    cost: args.cost,
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
export function apiSearchProjectList(args = {}) {
  return instance.get(
    `${baseUrl}/projects/criteria?page=${args.page}&pageSize=${args.pageSize}&projectName=${
      args.projectName
    }
    &startTime=${args.startTime}&endTime=${args.endTime}`,
  );
}
export function apiFetchProject(args = {}) {
  return instance.get(`${baseUrl}/projects/${args.projectId}`);
}

export function apiEnableProject(args = {}) {
  return instance.put(`/project/enable?projectId=${args.projectId}`);
}

export function apiDisbleProject(args = {}) {
  return instance.put(`/project/disable?projectId=${args.projectId}`);
}

export function apiFetchIssueList(args = {}) {
  return instance.get(
    `${baseUrl}/issues/criteria?projectId=${args.projectId}&page=${args.page}&pageSize=${
      args.pageSize
    }&projectName=${args.projectName}&type=${args.type}&status=${args.status}&interaction=${
      args.interaction
    }&issueName=${args.issueName}&startTime=${args.startTime}&endTime=${args.endTime}`,
  );
}
export function apiIssueDetail(args = {}) {
  return instance.get(`${baseUrl}/issues/${args.issueId}`);
}
export function apiFetchReplyList(args = {}) {
  return instance.get(`${baseUrl}/issues/${args.issueId}/feedback`);
}
export function apiFetchUserList(args = {}) {
  return instance.get(
    `${baseUrl}/user/criteria?page=${args.page}&pageSize=${args.pageSize}&projectName=${
      args.projectName
    }&username=${args.username}&roleName=${args.roleName}&status=${args.status}&nickname=${
      args.nickname
    }`,
  );
}
export function apiFetchRepliesList(args = {}) {
  return instance.get(`${baseUrl}/issues/${args.issueId}/replies`);
}

export function apiBindProject(args = {}) {
  return instance.put(
    `${baseUrl}/user/bindproject?username=${args.username}&projectId=${args.projectId}`,
  );
}

export function apiFetchCommentList(args = {}) {
  return instance.get(`${baseUrl}/issues/${args.issueId}/comments`);
}

export function apiCreateAcciunt(args = {}) {
  return instance.post(baseUrl + '/user/userroleproject', {
    username: args.username,
    nickname: args.nickname,
    roles: args.roles,
    phoneNumber: args.phoneNumber,
    email: args.email,
    password: args.password,
    status: args.status,
    projectIds: args.projectIds,
  });
}
export function apiUpdateAcciunt(args = {}) {
  return instance.put(baseUrl + '/user/userroleproject', {
    userId: args.userId,
    username: args.username,
    nickname: args.nickname,
    roles: args.roles,
    phoneNumber: args.phoneNumber,
    email: args.email,
    status: args.status,
    projectIds: args.projectIds,
  });
}

export function apiEditProject(args = {}) {
  const url = baseUrl + '/project';
  return instance.put(url, {
    id: args.id,
    name: args.name,
    cost: args.cost,
    startTime: args.startTime,
    endTime: args.endTime,
    location: args.location,
    overview: args.overview,
    designUnit: args.designUnit,
    monitorUnit: args.monitorUnit,
    constructionUnit: args.constructionUnit,
  });
}

export function apiCheckIfExist(args = {}) {
  return instance.get(`${baseUrl}/project/checkIfExist?projectName=${args.projectName}`);
}
