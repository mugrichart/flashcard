import { httpEndpoint } from "..";
import axios from "axios";

export default async (deckId) => {
    const userId = JSON.parse(localStorage.getItem('user')).userId;
    try {
        const res = await axios.get(`${ httpEndpoint }/cards/deck?deckId=${deckId}&userId=${userId}`);
        const deck = res.data.deck;
        return deck;
    } catch (error) {
        console.log(error)
        throw error
      }
}