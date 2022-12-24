import { useEffect, useState } from "react";
import { fetchCoordinates, fetchWeather } from "./serverApi.js";
import spinner from './assets/spinner.svg'
import removeIcon from './assets/remove.svg'

const App = () => {

    // Predefined list
    const cities = ['Berlin', 'London', 'Paris', 'tokyo', 'Kyiv'];

    const [cityData, setCityData] = useState([])
    const [time, setTime] = useState(0)
    const [times, setTimes] = useState([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {

        // fetch Location first, then weather for this location
        cities.map(async (city) => {
            const location = await fetchCoordinates(city)
            const { name, lat, lon } = location[0]
            const data = await fetchWeather({ lat, lon })

            const min = await data.daily.temperature_2m_min
            const max = await data.daily.temperature_2m_max
            const times = await data.daily.time

            setTimes(times)
            setCityData(state => [...state, { name, min, max }])
        })

        setLoading(false)

    }, [])


    // Sort Function
    const handleSort = (value) => {
        console.log('sort');
        if (value === 'name') {
            setCityData(state => ([...state.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))]))
        } else {
            setCityData(state => [...state.sort((a, b) => a[value][time] - b[value][time])])
        }
    }

    // Remove City 
    const removeCity = (name) => {
        console.log('remove')
        setCityData(state => state.filter(city => city.name !== name))
    }


    // If loading, show Spinnner

    if (loading) return <Spinner />

    return (
        <div className="flex flex-col items-center text-white">
            <Header />
            <Table removeCity={removeCity} handleSort={handleSort} cityData={cityData} time={time} />
            <DatePicker times={times} timeIndex={time} setTime={setTime} />
        </div>
    )
}


// Date picker Component
const DatePicker = ({ times, setTime, timeIndex }) => {
    const dates = times.map((time, i) => {
        const activeClass = timeIndex == i ? 'bg-white text-black' : null
    
        return (
            <div key={i} onClick={() => setTime(i)} className={`font-bold rounded-md border-2	 py-1 px-4  cursor-pointer ${activeClass}`}>{time}</div>
        )
    })

    return (
        <div className="border flex flex-col items-center mt-10 p-4">
            <h3 className="text-3xl mb-4 font-semibold">Choose Date</h3>
            <div className="flex gap-5">
                {dates}
            </div>
        </div>
    )
}

// Header
const Header = () => {
    return (
        <h3 className="text-7xl font-bold mt-10 mb-5">
            Weather app
        </h3>
    )
}


// Weather Table
const Table = ({ cityData, handleSort, removeCity, time }) => {

    const cityRows = cityData.map((city, i) => {
        const { name, max, min } = city
        return (
            <ul key={i} className="flex relative justify-between">
                <li className="font-semibold text-2xl py-2 px-4 flex items-center gap-2 flex-row-reverse">
                    {name}
                    <button onClick={() => removeCity(name)}>
                        <img src={removeIcon} alt="" />
                    </button>
                </li>
                <li className="font-semibold text-2xl py-2 px-4 flex-auto text-center absolute right-1/2 translate-x-1/2">{min[time]}</li>
                <li className="font-semibold text-2xl py-2 px-4">{max[time]}</li>
            </ul>
        )
    })

    return (
        <div className="w-2/3 mt-8 border p-4 rounded-2xl">
            <ul className="flex justify-between	relative">
                <button onClick={() => handleSort('name')} className="text-3xl font-semibold py-2 px-4">City</button>
                <button onClick={() => handleSort('min')} className="text-3xl font-semibold py-2 px-4 py-2 px-4 flex-auto text-center absolute right-1/2 translate-x-1/2">MinTemp</button>
                <button onClick={() => handleSort('max')} className="text-3xl font-semibold py-2 px-4">MaxTemp</button>
            </ul>
            {cityRows}
        </div>
    )
}


// Loader
const Spinner = () => {
    return (
        <img src={spinner} alt="" />
    )
}


export default App
