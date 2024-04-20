import { createSlice } from '@reduxjs/toolkit';

export const userReducer = createSlice({
  name: 'user',
  initialState: {
    user: null,
    wishlist: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
    },
  },
});

export const { setUser, setWishlist } = userReducer.actions;

export default userReducer.reducer;