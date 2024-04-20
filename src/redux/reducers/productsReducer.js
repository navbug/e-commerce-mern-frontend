import { createSlice } from "@reduxjs/toolkit";

export const productsReducer = createSlice({
  name: "products",
  initialState: {
    products: [],
    sortBy: "Featured",
    searchKeyword: "",
    category: "",
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },
});

export const { setProducts, setSortBy, setFilterValues, setSearchKeyword, setCategory } = productsReducer.actions;

export default productsReducer.reducer;
