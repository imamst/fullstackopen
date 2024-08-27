import { useEffect, useState } from 'react'
import countryService from './services/countries'

function App() {
  const [keyword, setKeyword] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [countryDetail, setCountryDetail] = useState(null)
  const [countryCapitalWeatherDetail, setCountryCapitalWeatherDetail] = useState(null)

  useEffect(() => {
    countryService
      .getAll()
      .then(data => setCountries(data))
  }, [])
  
  const searchCountries = (keyword) => {
    setCountryDetail(null)

    if (!keyword) {
      setFilteredCountries(countries)

      return
    }

    setFilteredCountries(countries.filter(country => {
      return (country.name?.common?.toLowerCase()?.includes(keyword) ||
        country.name?.official?.toLowerCase()?.includes(keyword))
    }))
  }

  useEffect(() => {
    if (keyword) {
      searchCountries(keyword)
    }
  }, [keyword])

  useEffect(() => {
    if (filteredCountries.length == 1) {
      setCountryDetail(filteredCountries[0])
    }
  }, [filteredCountries])

  const getWeatherCity = (city) => {
    if (!city) return

    countryService
      .getWeatherDetail(city)
      .then(({data}) => setCountryCapitalWeatherDetail(data))
  }

  useEffect(() => {
    getWeatherCity(countryDetail?.capital[0])
  }, [countryDetail])

  return (
    <>
      <div>
        find countries: <input required value={keyword} onChange={(e) => setKeyword(e.target.value?.toLowerCase())} />
      </div>

      {
        filteredCountries.length > 10 &&
        <p>Too many matches, specify another filter</p>
      }

      {
        filteredCountries.length > 1 && filteredCountries.length <= 10 &&
        filteredCountries.map(
          country => <p key={country.tld}>
            <b>{country.name?.common}</b> <button onClick={() => setCountryDetail(country)}>show</button>
          </p>
        )
      }

      {
        countryDetail && (
          <CountryDetail data={countryDetail} weather={countryCapitalWeatherDetail}/>
        )
      }
    </>
  )
}

const CountryDetail = ({ data, weather }) => {
  return (
    <div>
      <h2>{data?.name?.common}</h2>

      <p>Capital: {data?.capital[0]}</p>
      <p>Area: {data?.area}</p>

      <p><b>Languages:</b></p>
      <ul>
        {
          Object.keys(data?.languages)?.map((code) => <li key={code}>{data?.languages[code]}</li>)
        }
      </ul>

      <img src={data?.flags?.png} alt={data?.flags?.alt} />

      <h4><b>Weather in {data.capital[0]}</b></h4>

      <p>Temperature {weather?.main?.temp} Celcius</p>

      <img src={`https://openweathermap.org/img/wn/${weather?.weather[0]?.icon}@2x.png`} alt={weather?.weather[0]?.description} />

      <p>Wind {weather?.wind?.speed} m/s</p>
    </div>
  )
}

export default App
