import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { TCreatedOrder, TOrder } from '@utils-types';

import { clearConstructor } from './constructorSlice';
import { fetchFeed } from './feedSlice';
import { fetchProfileOrders } from './profileOrdersSlice';
import { getErrorMessage } from '../utils';

type TCreateOrderResponse = Awaited<ReturnType<typeof orderBurgerApi>>;

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TCreatedOrder | null;
  currentOrder: TOrder | null;
  currentOrderLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  currentOrderLoading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  TCreateOrderResponse['order'],
  string[],
  { rejectValue: string }
>('order/createOrder', async (ingredients, { dispatch, rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredients);
    dispatch(clearConstructor());
    dispatch(fetchFeed());
    dispatch(fetchProfileOrders());
    return response.order;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];

    if (!order) {
      return rejectWithValue('Заказ не найден.');
    }

    return order;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = {
          number: action.payload.number
        };
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload || 'Не удалось оформить заказ.';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrderLoading = false;
        state.error = action.payload || 'Не удалось загрузить данные заказа.';
      });
  }
});

export const { clearOrderModal, clearCurrentOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
