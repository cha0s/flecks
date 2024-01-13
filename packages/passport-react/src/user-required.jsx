import {PropTypes, React} from '@flecks/react';
import {Navigate, useLocation} from '@flecks/react/router';
import {useSelector} from '@flecks/redux';
import {userIdSelector} from '@flecks/passport';

function UserRequired({children, destination}) {
  const location = useLocation();
  const userId = useSelector(userIdSelector);
  if (0 === userId) {
    return <Navigate to={destination} state={{from: location}} replace />;
  }
  return children;
}

UserRequired.defaultProps = {
  destination: '/login',
};

UserRequired.displayName = 'UserRequired';

UserRequired.propTypes = {
  children: PropTypes.node.isRequired,
  destination: PropTypes.string,
};

export default UserRequired;
