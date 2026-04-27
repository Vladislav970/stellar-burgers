import { TConstructorIngredient, TIngredient } from '@utils-types';

import {
  addIngredient,
  burgerConstructorReducer,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from './constructorSlice';

const bun: TIngredient = {
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
};

const main: TIngredient = {
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
};

const sauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://example.com/sauce.png',
  image_large: 'https://example.com/sauce-large.png',
  image_mobile: 'https://example.com/sauce-mobile.png'
};

describe('burgerConstructor reducer', () => {
  it('adds bun and filling ingredients to constructor', () => {
    const stateWithBun = burgerConstructorReducer(
      undefined,
      addIngredient(bun)
    );
    const stateWithFilling = burgerConstructorReducer(
      stateWithBun,
      addIngredient(main)
    );

    expect(stateWithBun.bun).toEqual(bun);
    expect(stateWithFilling.ingredients).toHaveLength(1);
    expect(stateWithFilling.ingredients[0]).toEqual({
      ...main,
      id: expect.any(String)
    });
  });

  it('removes filling ingredient by generated id', () => {
    const firstIngredient: TConstructorIngredient = {
      ...main,
      id: 'main-id'
    };
    const secondIngredient: TConstructorIngredient = {
      ...sauce,
      id: 'sauce-id'
    };

    const state = burgerConstructorReducer(
      {
        bun,
        ingredients: [firstIngredient, secondIngredient]
      },
      removeIngredient('main-id')
    );

    expect(state.ingredients).toEqual([secondIngredient]);
  });

  it('changes filling ingredients order', () => {
    const firstIngredient: TConstructorIngredient = {
      ...main,
      id: 'main-id'
    };
    const secondIngredient: TConstructorIngredient = {
      ...sauce,
      id: 'sauce-id'
    };

    const movedDownState = burgerConstructorReducer(
      {
        bun,
        ingredients: [firstIngredient, secondIngredient]
      },
      moveIngredientDown(0)
    );
    const movedUpState = burgerConstructorReducer(
      movedDownState,
      moveIngredientUp(1)
    );

    expect(movedDownState.ingredients).toEqual([
      secondIngredient,
      firstIngredient
    ]);
    expect(movedUpState.ingredients).toEqual([
      firstIngredient,
      secondIngredient
    ]);
  });
});
