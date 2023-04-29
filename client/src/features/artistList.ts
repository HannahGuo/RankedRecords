import {
  createSlice
} from '@reduxjs/toolkit'

interface ListSettings {
	aList: ArtistObj[];
}

const initialState: ListSettings = {
  aList: [],
}

export const artistSlice = createSlice({
  name: 'artistList',
  initialState: initialState,
  reducers: {
    addtoEnd: (state, action) => {
      // Prevent duplicates
      let artistIndex = state.aList.findIndex(x => x[0].key === action.payload[0].key);
      if (artistIndex == -1) {
        state.aList.push(action.payload);
      }
    },
    removeArtist: (state, action) => {
      let artistIndex = state.aList.findIndex(x => x[0].key === action.payload.key);
      state.aList.splice(artistIndex, 1);
    }
  },
})

export const {
  addtoEnd,
  removeArtist
} = artistSlice.actions
export default artistSlice.reducer