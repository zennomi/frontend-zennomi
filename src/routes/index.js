import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';
// components
import LoadingScreen from '../components/LoadingScreen';
// paths
import { PATH_WIBU } from './paths';
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <Register />
            </GuestGuard>
          ),
        },
      ],
    },

    {
      path: '/loading',
      element: <LoadingScreen />
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to='/homepage' replace />, index: true },
        {
          path: '/homepage',
          element: <Homepage />
        },
        {
          path: '/profile',
          element: <Profile />
        },
        {
          path: '/statistics',
          element: <Statistics />
        },
        { path: PATH_WIBU.root, element: <Navigate to={PATH_WIBU.title.root} replace />, index: true },
        { path: PATH_WIBU.title.feed, element: <TitleFeed /> },
        { path: PATH_WIBU.title.root, element: <Titles /> },
        { path: PATH_WIBU.title.new, element: (<RoleBasedGuard accessibleRoles={['admin']}><NewTitle /></RoleBasedGuard>) },
        { path: PATH_WIBU.title.edit, element: (<RoleBasedGuard accessibleRoles={['admin']}><EditTitle /></RoleBasedGuard>) },
        { path: PATH_WIBU.title.delete, element: (<RoleBasedGuard accessibleRoles={['admin']}><DeleteTitle /></RoleBasedGuard>) },
        { path: PATH_WIBU.title.id, element: <Title /> },
        { path: PATH_WIBU.list.root, element: <Lists /> },
        { path: PATH_WIBU.list.id, element: <List /> },
        { path: PATH_WIBU.list.new, element: (<AuthGuard><NewList /></AuthGuard>) },
        { path: PATH_WIBU.list.edit, element: (<AuthGuard><EditList /></AuthGuard>) },
        { path: PATH_WIBU.list.delete, element: (<AuthGuard ><DeleteList /></AuthGuard>) },
      ]
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/one" replace />, index: true },
        { path: '/dashboard', element: <Navigate to="/dashboard/one" replace />, index: true },
        { path: '/dashboard/one', element: <PageOne /> },
        { path: '/dashboard/two', element: <PageTwo /> },
        { path: '/dashboard/three', element: <PageThree /> },
        {
          path: '/dashboard/user',
          children: [
            { element: <Navigate to="/dashboard/user/four" replace />, index: true },
            { path: '/dashboard/user/four', element: <PageFour /> },
            { path: '/dashboard/user/five', element: <PageFive /> },
            { path: '/dashboard/user/six', element: <PageSix /> },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// Root
const Homepage = Loadable(lazy(() => import('../pages/Homepage')));
const Profile = Loadable(lazy(() => import('../pages/Profile')));
const Statistics = Loadable(lazy(() => import('../pages/Statistics')));

// Authentication
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
const Register = Loadable(lazy(() => import('../pages/auth/Register')));
// Wibu
// Title
const Titles = Loadable(lazy(() => import('../pages/title/Titles')));
const TitleFeed = Loadable(lazy(() => import('../pages/title/TitleFeed')));
const Title = Loadable(lazy(() => import('../pages/title/Title')));
const NewTitle = Loadable(lazy(() => import('../pages/title/NewTitle')));
const EditTitle = Loadable(lazy(() => import('../pages/title/EditTitle')));
const DeleteTitle = Loadable(lazy(() => import('../pages/title/DeleteTitle')));
// List
const Lists = Loadable(lazy(() => import('../pages/list/Lists')));
const List = Loadable(lazy(() => import('../pages/list/List')));
const NewList = Loadable(lazy(() => import('../pages/list/NewList')));
const EditList = Loadable(lazy(() => import('../pages/list/EditList')));
const DeleteList = Loadable(lazy(() => import('../pages/list/DeleteList')));
// Dashboard
const PageOne = Loadable(lazy(() => import('../pages/PageOne')));
const PageTwo = Loadable(lazy(() => import('../pages/PageTwo')));
const PageThree = Loadable(lazy(() => import('../pages/PageThree')));
const PageFour = Loadable(lazy(() => import('../pages/PageFour')));
const PageFive = Loadable(lazy(() => import('../pages/PageFive')));
const PageSix = Loadable(lazy(() => import('../pages/PageSix')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
