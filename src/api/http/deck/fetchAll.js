import { httpEndpoint } from "../../../../serverConfig";
import axios from "axios";

export default async (userId, myCardsOnly, language) => {
    try {
        const query = {}
        if (userId) query['user'] = userId
        if (myCardsOnly) query['creator'] = userId
        if (language) query["language"] = language
        const response = await axios.get(`${ httpEndpoint }/cards/decks`, { params: query});
        return response.data;
      } catch (error) {
        //console.log(error)
        throw new Error(error.message === 'Network Error' ? 'Network Error!' : 'Error. Try again!');
      }
}