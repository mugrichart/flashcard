

import { httpEndpoint } from "../../../../serverConfig";
import AxiosWrapper from "../AxiosWrapper";

export default async(data) => {
    const res = await AxiosWrapper.post(httpEndpoint + '/live-chat/', data)
    return res.data
}