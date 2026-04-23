import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { TIngredient, TOrder } from '@utils-types';
import {
  selectCurrentOrder,
  selectCurrentOrderLoading,
  selectFeedOrders,
  selectIngredients,
  selectOrderError,
  selectProfileOrders
} from '@selectors';
import { clearCurrentOrder, fetchOrderByNumber } from '@slices';
import { useDispatch, useSelector } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);

  const currentOrder = useSelector(selectCurrentOrder);
  const currentOrderLoading = useSelector(selectCurrentOrderLoading);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectProfileOrders);
  const ingredients = useSelector(selectIngredients);
  const error = useSelector(selectOrderError);

  if (Number.isNaN(orderNumber)) {
    return (
      <div className='text text_type_main-medium pt-6'>Заказ не найден.</div>
    );
  }

  const orderData = useMemo(() => {
    const orderFromLists =
      profileOrders.find((order) => order.number === orderNumber) ||
      feedOrders.find((order) => order.number === orderNumber) ||
      null;

    if (orderFromLists) {
      return orderFromLists;
    }

    if (currentOrder?.number === orderNumber) {
      return currentOrder;
    }

    return null;
  }, [currentOrder, feedOrders, orderNumber, profileOrders]);

  useEffect(() => {
    if (!orderNumber || orderData) {
      return;
    }

    dispatch(fetchOrderByNumber(orderNumber));
  }, [dispatch, orderData, orderNumber]);

  useEffect(
    () => () => {
      dispatch(clearCurrentOrder());
    },
    [dispatch]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);

          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count += 1;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...(orderData as TOrder),
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (error && !orderInfo) {
    return <div className='text text_type_main-medium pt-6'>{error}</div>;
  }

  if (currentOrderLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
