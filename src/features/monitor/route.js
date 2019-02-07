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
  Project,
  ProjectCreation,
  Account,
  Previlige,
  Page403,
} from './';

export default {
  path: 'monitor',
  name: 'Monitor',
  component: Layout,
  childRoutes: [
    { path: '', name: 'Welcome page', component: WelComePage },
    { path: 'welcompage', name: 'Welcome page', component: WelComePage },
    { path: 'login', name: 'Login', component: Login },
    { path: 'togglelanguage', name: 'Toggle language', component: ToggleLanguage },
    {
      path: 'projects',
      roles: ['admin', 'leader', 'projectManager', 'projectUser', 'monitorManager', 'monitorUser'],
      name: 'Projects',
      component: Projects,
    },
    {
      path: 'project/:id',
      roles: ['admin', 'leader', 'projectManager', 'projectUser', 'monitorManager', 'monitorUser'],
      name: 'Project',
      component: Project,
    },
    {
      path: 'project/action/create',
      roles: ['admin'],
      name: 'Project creation',
      component: ProjectCreation,
    },
    {
      path: 'account/create',
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
  ],
};
