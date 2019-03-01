// This is the root reducer of the feature. It is used for:
//   1. Load reducers from each action in the feature and process them one by one.
//      Note that this part of code is mainly maintained by Rekit, you usually don't need to edit them.
//   2. Write cross-topic reducers. If a reducer is not bound to some specific action.
//      Then it could be written here.
// Learn more from the introduction of this approach:
// https://medium.com/@nate_wang/a-new-approach-for-managing-redux-actions-91c26ce8b5da.

import initialState from './initialState';
import { reducer as loginReducer } from './login';
import { reducer as languageSetZhReducer } from './languageSetZh';
import { reducer as languageSetEnReducer } from './languageSetEn';
import { reducer as logoutReducer } from './logout';
import { reducer as getAvailableTitleReducer } from './getAvailableTitle';
import { reducer as createUserReducer } from './createUser';
import { reducer as createProjectReducer } from './createProject';
import { reducer as getAvailableProjectsReducer } from './getAvailableProjects';
import { reducer as getAvailableProjectsSizeReducer } from './getAvailableProjectsSize';
import { reducer as getAvailableProjectIssuesReducer } from './getAvailableProjectIssues';
import { reducer as getAvailableProjectIssuesSizeReducer } from './getAvailableProjectIssuesSize';
import { reducer as fetchProjectListReducer } from './fetchProjectList';
import { reducer as fetchProjectReducer } from './fetchProject';
import { reducer as fetchIssueListReducer } from './fetchIssueList';

const reducers = [
  loginReducer,
  languageSetZhReducer,
  languageSetEnReducer,
  logoutReducer,
  getAvailableTitleReducer,
  createUserReducer,
  createProjectReducer,
  getAvailableProjectsReducer,
  getAvailableProjectsSizeReducer,
  getAvailableProjectIssuesReducer,
  getAvailableProjectIssuesSizeReducer,
  fetchProjectListReducer,
  fetchProjectReducer,
  fetchIssueListReducer,
];

export default function reducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
