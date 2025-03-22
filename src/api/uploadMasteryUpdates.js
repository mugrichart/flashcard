import API_BASE_URL from "../../serverConfig";
import axios from "axios";

export default async (wordsMasteriesList, deckId, deckLearnChunk) => {
    const userId = JSON.parse(localStorage.getItem('user')).userId;
    try {
        const performData = await axios.patch(`${API_BASE_URL}/cards/deck?deckId=${deckId}&userId=${userId}`, { wordsMasteriesList, deckLearnChunk });
        return performData.data;
    } catch (error) {
        throw error
      }
}