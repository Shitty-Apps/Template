import { Environment } from "../heplers/create-store";

export default {
  isLocal: import.meta.env.VITE_APP_IS_LOCAL === 'true',
  apiUrl: import.meta.env.VITE_APP_API_URL
} as Environment;
