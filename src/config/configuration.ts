import { Environment } from '../helpers/create-store';
const env = import.meta.env

export default {
  isLocal: env.VITE_APP_IS_LOCAL === 'true',
  apiUrl: env.VITE_APP_API_URL,
  bannerAdId: 'ca-app-pub-1275679285318015/5010279015',
  rewardingAdId: 'fake-id'
} as Environment;
