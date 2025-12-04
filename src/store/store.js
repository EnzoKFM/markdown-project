import blocksReducer from "./slices/blocksSlice";

export const store = configureStore({
  reducer: {
    blocks: blocksReducer,
    images: imagesReducer,
  },
});
