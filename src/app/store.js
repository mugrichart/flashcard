
import { configureStore } from "@reduxjs/toolkit";
//import { reduxLogger} from 'redux-logger'
import systemReducer from "../features/system/systemSlice";
import deckReducer from "../features/personal/deck/deckSlice";
import quizReducer from "../features/personal/quiz/quizSlice";
import authReducer from "../features/auth/authSlice";

//const logger = reduxLogger.createLogger()

const store = configureStore({
    reducer: {
        system: systemReducer,
        deck: deckReducer,
        quiz: quizReducer,
        auth: authReducer
    },
    //middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(logger),
})

export default store