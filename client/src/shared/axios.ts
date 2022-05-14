import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_SERVER_URL,
});

export default client;
