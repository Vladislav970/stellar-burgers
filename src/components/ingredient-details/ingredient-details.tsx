import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { selectIngredients, selectIngredientsLoading } from '@selectors';
import { useSelector } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredients = useSelector(selectIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsLoading);

  const ingredientData = useMemo(
    () => ingredients.find((ingredient) => ingredient._id === id) || null,
    [ingredients, id]
  );

  if (!ingredientData && isIngredientsLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <div className='text text_type_main-medium pt-6'>
        Ингредиент не найден.
      </div>
    );
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
