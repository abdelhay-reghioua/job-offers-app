export const Config = {
  // 🔥 IMPORTANT: Replace with YOUR PC's IP address!
  API_BASE_URL: 'http://192.168.0.155:8000/api',

  TIMEOUT: 15000, // 15 seconds

  STORAGE_KEYS: {
    TOKEN: 'auth_token',
    USER:  'auth_user',
  },
} as const;