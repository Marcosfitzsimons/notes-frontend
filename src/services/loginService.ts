import {  UserCredentials } from "@/types";
import axios from "../api/axios";

const login = async (credentials: UserCredentials) => {
    const {
        data: { token, details },
      } = await axios.post(`/auth/login`, credentials, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    return {
        token, details
    }
}

export default {
    login,
}