import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';
import { clearAuthError, forgotPassword } from '@slices';
import { selectAuthError } from '@selectors';
import { useDispatch, useSelector } from '../../services/store';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorText = useSelector(selectAuthError) || undefined;

  const [email, setEmail] = useState('');

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    try {
      await dispatch(forgotPassword({ email })).unwrap();
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    } catch {
      return;
    }
  };

  return (
    <ForgotPasswordUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
