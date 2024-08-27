import axios from 'axios'

const apiKey = import.meta.env.VITE_OPENWEATHERMAP_KEY

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => {
  return axios.get(`${baseUrl}/all`)
    .then(({data}) => data)
}

const getDetail = name => {
  return axios.get(`${baseUrl}/name/${name}`)
    .then(({data}) => data)
}

const getWeatherDetail = city => {
  return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
}

export default {
  getAll,
  getDetail,
  getWeatherDetail
}