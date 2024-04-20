import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../reducers/userReducer';
import productsReducer from './productsReducer';
import cartReducer from './cartReducer';

const rootReducer = combineReducers({
  user: userReducer,
  products: productsReducer,
  cart: cartReducer,
});

export default rootReducer;