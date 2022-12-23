import axios from "axios";

const API_BASE = 'https://api.open-meteo.com/v1/forecast'


export const fetchWeather = async () => {
    return await axios.get(`${API_BASE}?latitude=50.45&longitude=30.52&daily=temperature_2m_max,temperature_2m_min&current_weather=true&timezone=Europe%2FMoscow`);
}
