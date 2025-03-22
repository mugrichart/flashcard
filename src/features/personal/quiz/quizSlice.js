
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    quizType : '',
    quizLength : '',
    format: '',
    order: '',
}

const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        setQuizType: (state, action) => { state.quizType = action.payload },
        setQuizLength: (state, action) => { state.quizLength = action.payload },
        setFormat: (state, action) => { state.format = action.payload },
        setOrder: (state, action) => { state.order = action.payload }
    }
})

export default quizSlice.reducer;
export const { setQuizType, setQuizLength, setOrder, setFormat } = quizSlice.actions