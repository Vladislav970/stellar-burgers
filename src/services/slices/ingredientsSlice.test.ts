import { TIngredient } from '@utils-types';

import { fetchIngredients, ingredientsReducer } from './ingredientsSlice';

const ingredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://example.com/bun.png',
    image_large: 'https://example.com/bun-large.png',
    image_mobile: 'https://example.com/bun-mobile.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://example.com/main.png',
    image_large: 'https://example.com/main-large.png',
    image_mobile: 'https://example.com/main-mobile.png'
  }
];

describe('ingredients reducer', () => {
  it('sets loading state on request action', () => {
    const state = ingredientsReducer(
      undefined,
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state).toEqual({
      items: [],
      isLoading: true,
      error: null
    });
  });

  it('saves ingredients and resets loading on success action', () => {
    const state = ingredientsReducer(
      {
        items: [],
        isLoading: true,
        error: null
      },
      fetchIngredients.fulfilled(ingredients, 'request-id', undefined)
    );

    expect(state).toEqual({
      items: ingredients,
      isLoading: false,
      error: null
    });
  });

  it('saves error and resets loading on failed action', () => {
    const error = 'Не удалось загрузить ингредиенты';
    const state = ingredientsReducer(
      {
        items: ingredients,
        isLoading: true,
        error: null
      },
      fetchIngredients.rejected(
        new Error(error),
        'request-id',
        undefined,
        error
      )
    );

    expect(state).toEqual({
      items: ingredients,
      isLoading: false,
      error
    });
  });
});
