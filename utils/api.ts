import db from '../assets/data/db.json';

export function getProperties() {
  return db.properties;
}

export function getBookings() {
  return db.bookings;
}

export function getProfile() {
  return db.profile;
}


// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://192.168.1.12:3001',
//   timeout: 10000,
// });



// export default api;
