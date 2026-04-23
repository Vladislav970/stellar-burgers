import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Location, useLocation, useNavigate } from 'react-router-dom';

import { LoginUI } from '@ui-pages';
import { clearAuthError, loginUser } from '@slices';
import { selectAuthError } from '@selectors';
import { useDispatch, useSelector } from '../../services/store';

type TLocationState = {
  from?: Location;
};

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const errorText = useSelector(selectAuthError) || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      const from =
        (location.state as TLocationState | null)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch {
      return;
    }
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
