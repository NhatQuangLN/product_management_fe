import axios from "axios";
export const request = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
});