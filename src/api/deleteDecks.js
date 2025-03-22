import API_BASE_URL from "../../serverConfig";
import axios from "axios";

export default async (personalSelectedItem) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}/cards/deck?deckIds=${personalSelectedItem}`);
        return res.data;
      } catch (error) {
        throw error;
      }
}

