import { configureStore } from "@reduxjs/toolkit";
import blocksReducer from "./slices/blocksSlice";
import imagesReducer from "./imageSlice";

export const store = configureStore({
  reducer: {
    blocks: blocksReducer,
    images: imagesReducer,
  },
});
