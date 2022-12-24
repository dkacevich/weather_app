import axios from "axios";

const API_BASE = 'https://api.open-meteo.com/v1/forecast'
// const GEO_API_KEY = 'xg9AkVvUSFVVw2JVnxkILoN6OuosSdXWW4VjsKaE'
const GEO_API_KEY = '1536fbb322702faf3ce7caa2f41f0bbd'


export const fetchWeather = async ({lat, lon}) => {
    const res = await axios.get(`${API_BASE}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=Europe%2FMoscow`)
    return res.data
}

export const fetchCoordinates = async (cityName) => {
    const res = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${GEO_API_KEY}`);
    return res.data;
}

// export const fetchCoordinates = async (cityName) => {
//     const res = await axios.get(`https://api.api-ninjas.com/v1/geocoding?city=${cityName}`, {
//         headers: {
//             "X-Api-Key": GEO_API_KEY,
//         }
//     });
//     return res.data;
// }