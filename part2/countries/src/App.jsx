import { useEffect, useState } from 'react'
import countryService from './services/countries'

function App() {
  const [keyword, setKeyword] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])
  const [countryDetail, setCountryDetail] = useState(null)

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
          <CountryDetail data={countryDetail}/>
        )
      }
    </>
  )
}

const CountryDetail = ({ data }) => {
  return (
    <div>
      <h2>{data?.name?.common}</h2>

      <p>capital: {data?.capital[0]}</p>
      <p>area: {data?.area}</p>

      <p><b>languages:</b></p>
      <ul>
        {
          Object.keys(data?.languages)?.map((code) => <li key={code}>{data?.languages[code]}</li>)
        }
      </ul>

      <img src={data?.flags?.png} alt={data?.flags?.alt} />
    </div>
  )
}

export default App
