import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
// hooks
import useAuth from '../hooks/useAuth';
// components
import LoadingScreen from '../components/LoadingScreen';
// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const { user, isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || (isAuthenticated && !accessibleRoles.includes(user.role))) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
