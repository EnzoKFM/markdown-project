import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
  name: "images",
  initialState: {
    list: [],
    dropZoneList: []
  },
  reducers: {
    setImages(state, action) {
      state.list = action.payload;
    },
    addImage(state, action) {
      state.list.push(action.payload);
    },
    deleteImage(state, action) {
      state.list = state.list.filter((img) => img.id !== action.payload);
    },
    renameImage(state, action) {
      const { id, newName } = action.payload;
      const target = state.list.find((img) => img.id === id);
      if (target) target.name = newName;
    },
  },
});

export const { setImages, addImage, deleteImage, renameImage } = imageSlice.actions;

export default imageSlice.reducer;
