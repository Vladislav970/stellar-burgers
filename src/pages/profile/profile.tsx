import { ChangeEvent, FC, SyntheticEvent, useEffect, useState } from 'react';

import { ProfileUI } from '@ui-pages';
import { clearAuthError, updateUser } from '@slices';
import { selectUpdateUserError, selectUser } from '@selectors';
import { useDispatch, useSelector } from '../../services/store';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUpdateUserError) || undefined;

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  }, [user]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    Boolean(formValue.password);

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    const payload = {
      name: formValue.name,
      email: formValue.email,
      ...(formValue.password ? { password: formValue.password } : {})
    };

    try {
      await dispatch(updateUser(payload)).unwrap();
      setFormValue((currentState) => ({
        ...currentState,
        password: ''
      }));
    } catch {
      return;
    }
  };

  const handleCancel = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatch(clearAuthError());
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
