import { configureStore } from "@reduxjs/toolkit";
import imagesReducer from "./imageSlice";

const store = configureStore({
  reducer: {
    images: imagesReducer,
  },
});


export default store;