import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  subtotal: 0,
  shippingCharges: 0,
  total: 0,
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  }
};

export const cartReducer = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addToCart: (state, action) => {
      const { _id } = action.payload;
      // Check if the product is already in the cart
      const existingProduct = state.cartItems.find((item) => item._id === _id);
      // If the product is not already in the cart, add it
      if (!existingProduct) {
        state.cartItems.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      const _id = action.payload;
      console.log(action.payload);
      state.cartItems = state.cartItems.filter((item) => item._id !== _id);
    },
    changeQuantity: (state, action) => {
      const { id: _id, qty: quantity } = action.payload;
      const item = state.cartItems.find((item) => item._id === _id);
      if (item) {
        // Update the quantity
        state.cartItems = state.cartItems.map((item) =>
          item._id === _id ? { ...item, quantity: quantity } : item
        );
      }
    },
    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
    calculatePrice: (state) => {
      const subtotal = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      state.subtotal = subtotal;
      state.shippingCharges = state.subtotal > 1000 ? 0 : 200;
      state.total = state.subtotal + state.shippingCharges;
    },
    resetCart: () => initialState,
  },
});

export const {
  addToCart,
  removeFromCart,
  changeQuantity,
  saveShippingInfo,
  calculatePrice,
  resetCart,
} = cartReducer.actions;

export default cartReducer.reducer;
