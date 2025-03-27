import { fetchDeck } from "../api/http"
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { openDeck } from "../features/personal/deck/deckSlice";

export default () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch()

    return (deckId) => {
        if (!deckId) {
            const deckIdHere = searchParams.get('deck')
            if (deckIdHere) {
                fetchDeck(deckIdHere)
                .then(deck => dispatch(openDeck(deck)))
                return deckIdHere
            }
        }
        else return deckId
    }
}