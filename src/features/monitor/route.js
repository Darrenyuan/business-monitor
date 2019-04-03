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
  AccountStep1,
  AccountStep2,
  AccountStep3,
  AccountStep4,
  ResetPassword,
  BindProject,
} from './';
import Issues from './Issues';
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
    // { path: 'account/create/step/1', name: 'Account step 1', component: AccountStep1 },
    // { path: 'account/create/step/2', name: 'Account step 2', component: AccountStep2 },
    // { path: 'account/create/step/3', name: 'Account step 3', component: AccountStep3 },
    // { path: 'account/create/step/4', name: 'Account step 4', component: AccountStep4 },
  ],
};
