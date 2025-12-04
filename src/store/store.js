import { configureStore } from "@reduxjs/toolkit";
import blocksReducer from "./slices/blocksSlice";

const store = configureStore({
  reducer: {
    blocks: blocksReducer,
  },
});

export default store;
