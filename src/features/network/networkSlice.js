

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    socket: null
}

const networkSlice = createSlice({
    name: "network",
    initialState,
    reducers: {
        createSocket: (state, action) => { state.socket = action.payload}
    }
})


export default networkSlice.reducer;
export const { createSocket } = networkSlice.actions