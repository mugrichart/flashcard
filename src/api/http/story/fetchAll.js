import { httpEndpoint } from "..";
import axios from "axios";

export default async (deckId) => {
    try {
        const response = await axios.get(`${ httpEndpoint }/cards/story-time/${deckId}`);
        const { stories } = response.data;
        return stories
      } catch (error) {
        //console.log(error)
        throw new Error(error.message === 'Network Error' ? 'Network Error!' : 'Error. Try again!');
      }
}
