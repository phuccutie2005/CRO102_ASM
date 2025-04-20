import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  pots: [], // ✅ thêm pots vô đây
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setPots: (state, action) => {
      state.pots = action.payload;
    },
  },
});

export const { setProducts, setPots } = productsSlice.actions;
export default productsSlice.reducer;
