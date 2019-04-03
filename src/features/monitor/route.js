// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html

// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html
// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html
// This is the JSON way to define React Router rules in a Rekit app.
// Learn more from: http://rekit.js.org/docs/routing.html
import {
  Login,
  WelComePage,
  Layout,
  ToggleLanguage,
  Projects,
  ProjectCreation,
  Account,
  // Home,
  Previlige,
  Page403,
  ResetPassword,
  BindProject,
  IssueDetail,
} from './';
import Issues from './Issues';
import IssuesList from './issuesList';
import IssuesDetails from './IssuesDetails';
import AccountList from './accountList';
import createAccount from './Createacciunt';
import Home from './Home';
export default {
  path: 'monitor',
  name: 'Monitor',
  component: Layout,
  childRoutes: [
    { path: '', name: 'Welcome page', component: WelComePage },
    { path: 'welcompage', name: 'Welcome page', component: WelComePage },
    { path: 'login', name: 'Login', component: Login },
    { path: 'togglelanguage', name: 'Toggle language', component: ToggleLanguage },
    { path: 'home', name: 'home', component: Home },
    {
      path: 'projects/:page',
      roles: [
        'admin',
        'leader',
        'projectManager',
        'projectDirector',
        'produceDirector',
        'professionalForeman',
        'securityGuard',
        'qualityInspector',
        'materialStaff',
        'monitorManager',
        'chiefInspector',
        'specializedSupervisionEngineer',
        'ownerEngineer',
      ],
      name: 'Projects',
      component: Projects,
    },
    {
      path: 'project/:projectId/issues/:page',
      roles: [
        'admin',
        'leader',
        'projectManager',
        'projectDirector',
        'produceDirector',
        'professionalForeman',
        'securityGuard',
        'qualityInspector',
        'materialStaff',
        'monitorManager',
        'chiefInspector',
        'specializedSupervisionEngineer',
        'ownerEngineer',
      ],
      name: 'Issues',
      component: Issues,
    },
    {
      path: 'project/action/create',
      roles: ['admin'],
      name: 'Project creation',
      component: ProjectCreation,
    },
    {
      path: 'account/create/step',
      roles: ['admin', 'projectManager', 'monitorManager'],
      name: 'Account',
      component: Account,
    },
    {
      path: 'previlige',
      roles: ['admin', 'projectManager', 'monitorManager'],
      name: 'Previlige',
      component: Previlige,
    },
    { path: '403', name: 'Page 403', component: Page403 },
    { path: 'account/reset', name: 'Reset password', component: ResetPassword },
    { path: 'bindproject', name: 'Bind project', component: BindProject },
    {
      path: 'issues/:id',
      name: 'Issue detail',
      component: IssueDetail,
      roles: [
        'admin',
        'leader',
        'projectManager',
        'projectDirector',
        'produceDirector',
        'professionalForeman',
        'securityGuard',
        'qualityInspector',
        'materialStaff',
        'monitorManager',
        'chiefInspector',
        'specializedSupervisionEngineer',
        'ownerEngineer',
      ],
    },
    { path: 'issuesList', name: 'IssuesList', component: IssuesList },
    { path: 'issuesList/issuesDetail/:issueId', name: 'IssuesDetail', component: IssuesDetails },
    { path: 'accountList', name: 'accountList', component: AccountList },
    { path: 'createAccount', name: 'accountList', component: createAccount },
  ],
};
