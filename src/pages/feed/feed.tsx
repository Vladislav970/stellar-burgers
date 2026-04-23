import { FC, useEffect } from 'react';
import clsx from 'clsx';

import { FeedUI } from '@ui-pages';
import { Preloader } from '@ui';
import {
  selectFeedError,
  selectFeedOrders,
  selectFeedLoading,
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '@selectors';
import { fetchFeed } from '@slices';
import { useDispatch, useSelector } from '../../services/store';

const FEED_POLL_INTERVAL = 10000;

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isFeedLoading = useSelector(selectFeedLoading);
  const feedError = useSelector(selectFeedError);
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  useEffect(() => {
    dispatch(fetchFeed());

    const intervalId = window.setInterval(() => {
      dispatch(fetchFeed());
    }, FEED_POLL_INTERVAL);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeed());
  };

  if (
    (isFeedLoading && !orders.length) ||
    (isIngredientsLoading && !ingredients.length)
  ) {
    return <Preloader />;
  }

  if (
    (feedError && !orders.length) ||
    (ingredientsError && !ingredients.length)
  ) {
    return (
      <div className={clsx('text text_type_main-medium pt-10 pl-5')}>
        {feedError || ingredientsError}
      </div>
    );
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
