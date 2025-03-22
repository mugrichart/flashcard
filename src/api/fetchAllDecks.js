import API_BASE_URL from "../../serverConfig";
import axios from "axios";

export default async (userId, myCardsOnly, language) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/cards/decks?user=${userId}&creator=${myCardsOnly ? userId : ''}&language=${language || ''}`);
        return response.data;
      } catch (error) {
        console.log(error)
        throw new Error(error.message === 'Network Error' ? 'Network Error!' : 'Error. Try again!');
      }
}