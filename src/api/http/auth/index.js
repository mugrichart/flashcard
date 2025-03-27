
import { httpEndpoint } from "..";
import axios from "axios";


export const register = async (username, email, password) => {
    try {
        await axios.post(`${ httpEndpoint }/auth/register`, { username, email, password });
        return
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const login = async (email, password) => {
    console.log(httpEndpoint)
    try {
        const res = await axios.post(`${ httpEndpoint }/auth/login`, { email, password });
        return res;
    } catch (error) {
        console.log(error)
        throw error
      }
}
