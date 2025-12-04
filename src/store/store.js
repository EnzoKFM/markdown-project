import { configureStore } from "@reduxjs/toolkit";
import imagesReducer from "./imageSlice";
import blocksReducer from "./slices/blocksSlice";

export const store = configureStore({
  reducer: {
    blocks: blocksReducer,
    images: imagesReducer,
  },
});
