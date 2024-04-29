import React, { useState, useEffect } from 'react'
import './App.css'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const WeatherSearch = () => {
  const [searchInput, setSearchInput] = useState('')
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecastData, setForecastData] = useState(null)



  const KEYAPI = '968532880ca14f4b8f2163223241203'
  const APIURL = 'http://api.weatherapi.com/v1'

  // on accède à la géolocalisation de l'user dès le chargement de la page pour afficher la météo du jour et des 3 prochains jours
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords
      fetchCurrentWeather(`${latitude},${longitude}`)
      fetchForecast(`${latitude},${longitude}`)
    })
  }, [])

  // Fonction pour récupérer la météo actuelle du jour via l'api 
  const fetchCurrentWeather = async (location) => {
    const url = `${APIURL}/current.json?key=${KEYAPI}&q=${location}&lang=fr`
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      setCurrentWeather(data)
    }
  }

  // Fonction pour récupérer les données météos de l'api sur trois jours
  const fetchForecast = async (location) => {
    const url = `${APIURL}/forecast.json?key=${KEYAPI}&q=${location}&days=3&lang=fr`
    const response = await fetch(url)
    if (response.ok) {
      const data = await response.json()
      setForecastData(data)
    }
  }

  const searchWeather = () => {
    if (!searchInput) {
      return
    }
    fetchCurrentWeather(searchInput)
    fetchForecast(searchInput)
    setSearchInput('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchWeather()
    }
  }

  return (
    <div>
      <input type="text" className="searchBar" placeholder="Entrez le nom d'une ville" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleKeyPress} />
      <button onClick={searchWeather}>Rechercher</button>
      {currentWeather && (
        <div className="weatherInfo">
          <h2>Actuellement à {currentWeather.location.name}, {currentWeather.location.country}</h2>
          <p>Température: {currentWeather.current.temp_c}°C</p>
          <p>Condition météorologique: {currentWeather.current.condition.text}</p>
          <p>Heure locale: {format(new Date(currentWeather.location.localtime), 'HH:mm', { locale: fr })}</p>
          <img src={`https:${currentWeather.current.condition.icon}`} alt="Icône météo" />
        </div>
      )}

      {forecastData && (
        <div className="forecastSection">
          <h3>Prévisions pour les 3 prochains jours:</h3>
          {forecastData.forecast.forecastday.map((day, index) => (
            <div key={index} className="forecastInfo">
              <h4>{format(new Date(day.date), 'EEEE dd MMMM', { locale: fr })}</h4>
              <p>Température maximale : {day.day.maxtemp_c}°C</p>
              <p>Température minimale : {day.day.mintemp_c}°C</p>
              <p>Condition météorologique: {day.day.condition.text}</p>
              <img src={`https:${day.day.condition.icon}`} alt="Icône météo" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
export default WeatherSearch
