import { FC, ReactElement } from 'react';
import { Location, Navigate, Outlet, useLocation } from 'react-router-dom';

import { Preloader } from '@ui';
import { selectAuthChecked, selectIsAuthenticated } from '@selectors';
import { useSelector } from '../../services/store';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children?: ReactElement;
};

type TLocationState = {
  from?: Location;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const location = useLocation();
  const isAuthChecked = useSelector(selectAuthChecked);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from =
      (location.state as TLocationState | null)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children || <Outlet />;
};
