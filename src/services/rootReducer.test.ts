import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  it('returns correct initial store state for unknown action', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        items: [],
        isLoading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        currentOrder: null,
        currentOrderLoading: false,
        error: null
      },
      feed: {
        data: {
          orders: [],
          total: 0,
          totalToday: 0
        },
        isLoading: false,
        error: null
      },
      profileOrders: {
        orders: [],
        isLoading: false,
        error: null
      },
      auth: {
        user: null,
        isAuthChecked: false,
        isLoading: false,
        error: null,
        updateUserError: null
      }
    });
  });
});
