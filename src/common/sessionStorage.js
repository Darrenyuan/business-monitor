export const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = state => {
  try {
    const serializedState = JSON.stringify(state);
    sessionStorage.setItem('state', serializedState);
  } catch (err) {
    // ignore
  }
};

export const loadProjectListPageSize = () => {
  try {
    const serializedProjectListPageSize = sessionStorage.getItem('projectList:page:size');
    if (serializedProjectListPageSize === null) {
      return 10;
    }
    return parseInt(serializedProjectListPageSize, 10);
  } catch (err) {
    return 10;
  }
};

export const saveProjectListPageSize = projectListPageSize => {
  try {
    sessionStorage.setItem('projectList:page:size', projectListPageSize);
  } catch (err) {
    // ignore
  }
};

export const loadIssueListPageSize = () => {
  try {
    const serializedProjectListPageSize = sessionStorage.getItem('issueList:page:size');
    if (serializedProjectListPageSize === null) {
      return 10;
    }
    return parseInt(serializedProjectListPageSize, 10);
  } catch (err) {
    return 10;
  }
};

export const saveIssueListPageSize = projectListPageSize => {
  try {
    sessionStorage.setItem('issueList:page:size', projectListPageSize);
  } catch (err) {
    // ignore
  }
};
