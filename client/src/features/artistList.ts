import {
  PayloadAction,
  createSlice
} from '@reduxjs/toolkit'

interface ListSettings {
	aList: ArtistObj[];
  curArtistID: string;
}

const initialState: ListSettings = {
  aList: [],
  curArtistID: undefined
}

export const artistSlice = createSlice({
  name: 'artistList',
  initialState: initialState,
  reducers: {
    addtoEnd: (state, action: PayloadAction<ArtistObj>) => {
      // Prevent duplicates
      let artistIndex = state.aList.findIndex(x => x.key === action.payload.key);
      if (artistIndex == -1) {
        state.aList.push(action.payload);
      }
    },
    removeArtist: (state, action:PayloadAction<string>) => {
      let artistIndex = state.aList.findIndex(x => x.id === action.payload);
      state.aList.splice(artistIndex, 1);
    },
    updateArtistID: (state, action:PayloadAction<string>) => {
      state.curArtistID = action.payload;
    }
  },
})

export const {
  addtoEnd,
  removeArtist,
  updateArtistID
} = artistSlice.actions
export default artistSlice.reducer