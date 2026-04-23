import { FC } from 'react';
import clsx from 'clsx';

import { BurgerConstructor, BurgerIngredients } from '@components';
import { Preloader } from '@ui';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsLoading
} from '@selectors';
import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

export const ConstructorPage: FC = () => {
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  if (isIngredientsLoading && !ingredients.length) {
    return <Preloader />;
  }

  if (error && !ingredients.length) {
    return (
      <div className={clsx(styles.title, 'text text_type_main-medium pt-4')}>
        {error}
      </div>
    );
  }

  return (
    <main className={styles.containerMain}>
      <h1
        className={clsx(
          styles.title,
          'text text_type_main-large mt-10 mb-5 pl-5'
        )}
      >
        Соберите бургер
      </h1>
      <div className={clsx(styles.main, 'pl-5 pr-5')}>
        <BurgerIngredients />
        <BurgerConstructor />
      </div>
    </main>
  );
};
