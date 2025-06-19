import { BACKEND_URL } from "@/constants/env";
import axios from "axios";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

export default api;
