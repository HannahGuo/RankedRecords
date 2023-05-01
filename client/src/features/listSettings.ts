import {
	createSlice
} from '@reduxjs/toolkit'

export enum SortMethod {
	POPULARITY = "popularity",
	CHRONOLOGY = "release_date"
}

export const enum SortDirection {
	ASCENDING = "ascending",
	DESCENDING = "descending"
}

export interface ListSettings {
	sortMethod: SortMethod,
	sortDirection: SortDirection,
	filterOptions?: string[]
}

const initialState: ListSettings = {
	sortMethod: SortMethod.CHRONOLOGY,
	sortDirection: SortDirection.DESCENDING,
	filterOptions: []
}

export const listSettingsSlice = createSlice({
	name: 'listSettings',
	initialState,
	reducers: {
		changeSortMethod: (state, action) => {
			state.sortMethod = action.payload;
		},
		toggleSortDirection: (state) => {
			if(state.sortDirection === SortDirection.ASCENDING) {
				state.sortDirection = SortDirection.DESCENDING;
			} else {
				state.sortDirection = SortDirection.ASCENDING;
			}
		},
		changeSortDirection: (state, action) => {
			state.sortDirection = action.payload;
		},
		setFilters: (state, action) => {
			state.filterOptions = action.payload;
		}
	},
})

export const {
	changeSortMethod,
	toggleSortDirection,
	changeSortDirection,
	setFilters
} = listSettingsSlice.actions
export default listSettingsSlice.reducer