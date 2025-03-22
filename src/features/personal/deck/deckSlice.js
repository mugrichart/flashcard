
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    deckList: [],
    openDeck: {
        deckName: '',
        deckLang: '',
        creator: '',
        words: [],
        learning: {}
    }
}

const deckSlice = createSlice({
    name: 'deck',
    initialState,
    reducers: {
        openDeck: (state, action) => {state.openDeck = action.payload },
        deckList: (state, action) => {state.deckList = action.payload},
        removeDecks: (state, action) => {
            const deletingSet = action.payload;
            state.deckList = state.deckList.filter(deck => !deletingSet.includes(deck._id));
        },
        push: (state, action) => {
            const newDeck = action.payload
            state.deckList = [...state.deckList.filter(deck => deck._id !== newDeck._id), newDeck]
        }
    }
})

export default deckSlice.reducer;
export const { openDeck, deckList, removeDecks, push } = deckSlice.actions