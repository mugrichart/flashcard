import { httpEndpoint } from "..";
import axios from "axios";

export default async (personalSelectedItem) => {
    try {
        const res = await axios.delete(`${ httpEndpoint }/cards/deck?deckIds=${personalSelectedItem}`);
        return res.data;
      } catch (error) {
        throw error;
      }
}
