import axios from 'axios';

// IMPORTANT:
// Set USE_LOCAL_DB = true before building the app if you want the app to always use the bundled db.json data.
// This will make the app use static data from db.json everywhere (emulator, real device, offline, etc).
// The data will not update unless you rebuild the app with a new db.json.
// Set USE_LOCAL_DB = false to use the API server instead.

// Toggle this flag to switch between local db.json and real API
const USE_LOCAL_DB = true; // Set to true to use local db.json, false to use real API

const api = axios.create({
  baseURL: 'http://192.168.1.12:3001',
  timeout: 10000,
});

export default api;
