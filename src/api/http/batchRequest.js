import { httpEndpoint } from "../../../serverConfig";
import axios from "axios";

export default async (requests) => {
    try {
        const response = await axios.post({ httpEndpoint } + '/batch-request', { requests })
        return response.data
    } catch (error) {
        throw error
    }
}