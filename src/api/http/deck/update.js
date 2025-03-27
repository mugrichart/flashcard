import { httpEndpoint } from "..";
import axios from "axios";

export default async (wordsMasteriesList, deckId, deckLearnChunk) => {
    const userId = JSON.parse(localStorage.getItem('user')).userId;
    try {
        const performData = await axios.patch(`${ httpEndpoint }/cards/deck?deckId=${deckId}&userId=${userId}`, { wordsMasteriesList, deckLearnChunk });
        return performData.data;
    } catch (error) {
        throw error
      }
}