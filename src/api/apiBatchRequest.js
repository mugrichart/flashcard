import API_BASE_URL from "../../serverConfig";
import axios from "axios";

export default async (requests) => {
    try {
        const response = await axios.post(API_BASE_URL + '/batch-request', { requests })
        return response.data
    } catch (error) {
        throw error
    }
}