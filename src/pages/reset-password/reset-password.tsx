import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ResetPasswordUI } from '@ui-pages';
import { clearAuthError, resetPassword } from '@slices';
import { selectAuthError } from '@selectors';
import { useDispatch, useSelector } from '../../services/store';

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorText = useSelector(selectAuthError) || undefined;

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());

    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [dispatch, navigate]);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      await dispatch(resetPassword({ password, token })).unwrap();
      localStorage.removeItem('resetPassword');
      navigate('/login', { replace: true });
    } catch {
      return;
    }
  };

  return (
    <ResetPasswordUI
      errorText={errorText}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
