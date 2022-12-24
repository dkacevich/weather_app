import { useEffect, useState } from "react";
import { fetchCoordinates, fetchWeather } from "./serverApi.js";
import ClipLoader from "react-spinners/ClipLoader";
import spinner from './assets/spinner.svg'
import removeIcon from './assets/remove.svg'

const App = () => {

    const cities = ['Berlin', 'London', 'Paris', 'Lutsk', 'Rivne'];

    const [cityData, setCityData] = useState([])
    // const [date, setDate] = useState(0)
    const [loading, setLoading] = useState(true)





    useEffect(() => {

        cities.map(async (city) => {
            const location = await fetchCoordinates(city)
            const { name, lat, lon } = location[0]
            const data = await fetchWeather({ lat, lon })

            const min = data.daily.temperature_2m_min[0]
            const max = data.daily.temperature_2m_max[0]


            setCityData(state => [...state, { name, min, max }])
        })

        setLoading(false)

    }, [])


    const handleSort = (value) => {
        console.log('sort');
        if (value === 'name') {
            setCityData(state => ([...state.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))]))
        } else {
            setCityData(state => [...state.sort((a, b) => a[value] - b[value])])
        }
    }

    const removeCity = (name) => {
        console.log(name)
        setCityData(state => state.filter(city => city.name !== name))
    }

    if (loading) return <Spinner />

    return (
        <div className="flex flex-col items-center text-white">
            <Header />
            <Table removeCity={removeCity} handleSort={handleSort} cityData={cityData} />
            <DatePicker />
        </div>
    )
}

const DatePicker = () => {
    return (
        <h3>Pick Dateffa</h3>
    )
}

const Header = () => {
    return (
        <h3 className="text-4xl font-semibold my-10">
            Weather app!
        </h3>
    )
}


const Table = ({ cityData, handleSort, removeCity }) => {

    const cityRows = cityData.map((city, i) => {
        const { name, max, min } = city
        return (
            <ul key={i} className="flex relative justify-between">
                <li className="py-2 px-4 flex items-center gap-2 flex-row-reverse">
                    {name}
                    <button onClick={() => removeCity(name)}>
                        <img src={removeIcon} alt="" />
                    </button>
                </li>
                <li className="py-2 px-4 flex-auto text-center absolute right-1/2 translate-x-1/2">{min}</li>
                <li className="py-2 px-4">{max}</li>
            </ul>
        )
    })

    return (
        <div className="w-2/3 mt-8 border p-4 rounded-2xl">
            <ul className="flex justify-between	relative">
                <button onClick={() => handleSort('name')} className="py-2 px-4">City</button>
                <button onClick={() => handleSort('min')} className="py-2 px-4 py-2 px-4 flex-auto text-center absolute right-1/2 translate-x-1/2">MinTemp</button>
                <button onClick={() => handleSort('max')} className="py-2 px-4">MaxTemp</button>
            </ul>
            {cityRows}
        </div>
    )
}


const Spinner = () => {
    return (
        <img src={spinner} alt="" />
    )
}


export default App
