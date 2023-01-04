import { configureStore, createSlice } from '@reduxjs/toolkit'

function counterReducer(state = { value: 0 }, action) {
	switch (action.type) {
	  case 'counter/incremented':
		return { value: state.value + 1 }
	  case 'counter/decremented':
		return { value: state.value - 1 }
	  default:
		return state
	}
  }

  
export default configureStore({
	reducer: {
		counter: counterReducer
	}
})