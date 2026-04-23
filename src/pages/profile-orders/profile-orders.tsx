import { FC, useEffect } from 'react';
import clsx from 'clsx';

import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading,
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersLoading
} from '@selectors';
import { fetchProfileOrders } from '@slices';
import { useDispatch, useSelector } from '../../services/store';

const PROFILE_ORDERS_POLL_INTERVAL = 10000;

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);
  const error = useSelector(selectProfileOrdersError);
  const ingredients = useSelector(selectIngredients);
  const ingredientsError = useSelector(selectIngredientsError);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  useEffect(() => {
    dispatch(fetchProfileOrders());

    const intervalId = window.setInterval(() => {
      dispatch(fetchProfileOrders());
    }, PROFILE_ORDERS_POLL_INTERVAL);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [dispatch]);

  if (
    (isLoading && !orders.length) ||
    (isIngredientsLoading && !ingredients.length)
  ) {
    return <Preloader />;
  }

  if ((error && !orders.length) || (ingredientsError && !ingredients.length)) {
    return (
      <div className={clsx('text text_type_main-medium pt-10 pl-5')}>
        {error || ingredientsError}
      </div>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
