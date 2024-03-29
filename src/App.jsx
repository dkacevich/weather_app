import { useEffect, useState } from "react";
import { fetchCoordinates, fetchWeather } from "./serverApi.js";
import spinner from './assets/spinner.svg'
import removeIcon from './assets/remove.svg'
import dropdown from './assets/dropdown.svg'

const App = () => {

    // Predefined list
    const cities = ['Berlin', 'London', 'Paris', 'tokyo', 'Kyiv'];

    const [cityData, setCityData] = useState([])
    const [time, setTime] = useState(0)
    const [times, setTimes] = useState([])
    const [activeSort, setActiveSort] = useState('');
    const [sortReverse, setSortReverse] = useState(false)
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        // fetch Location first, then weather for this location
        Promise.all(
            cities.map(handleFetching)
        ).then(() => {
            setLoading(false)
        })

    }, [])


    const handleFetching = async (city) => {
        try {
            const location = await fetchCoordinates(city)
            const { name, lat, lon, country } = location[0]
            const data = await fetchWeather({ lat, lon })

            const min = await data.daily.temperature_2m_min
            const max = await data.daily.temperature_2m_max
            const times = await data.daily.time

            setTimes(times)
            setCityData(state => [...state, { name, min, max, country}])
        } catch (error) {
            console.log('error')
        }
    }


    // Main sort Function
    const handleSort = (label) => {
        if (activeSort !== label | sortReverse === true) {
            setSortReverse(false)
            if (activeSort !== label) setActiveSort(label)

            if (label === 'name') {
                setCityData(state => ([...state.sort((a, b) => (a[label] > b[label]) ? 1 : -1)]))
            } else {
                setCityData(state => [...state.sort((a, b) => a[label][time] - b[label][time])])
            }
        }
        else {
            setSortReverse(true)
            if (label === 'name') {
                setCityData(state => ([...state.sort((a, b) => (b[label] > a[label]) ? 1 : -1)]))
            } else {
                setCityData(state => [...state.sort((a, b) => b[label][time] - a[label][time])])
            }
        }
    }

    // Sorting after change date or add new city
    const manualSort = (time) => {

        const label = activeSort;
        if (sortReverse) {
            if (label === 'name') {
                setCityData(state => ([...state.sort((a, b) => (b[label] > a[label]) ? 1 : -1)]))
            } else {
                setCityData(state => [...state.sort((a, b) => b[label][time] - a[label][time])])
            }
        } else {
            if (label === 'name') {
                setCityData(state => ([...state.sort((a, b) => (a[label] > b[label]) ? 1 : -1)]))
            } else {
                setCityData(state => [...state.sort((a, b) => a[label][time] - b[label][time])])
            }
        }
    }

    // Remove City 
    const removeCity = (name) => {
        setCityData(state => state.filter(city => city.name !== name))
    }

    // Set time and keep sorting order
    const handleTimeSet = (time) => {
        setTime(time)
        if (activeSort) manualSort(time)
    }

    const handlePrefetch = async (city) => {
        setLoading(true)

        await handleFetching(city)
        if (activeSort) manualSort(time)

        setLoading(false)
    }

    const content = (
        <>
            <CityForm handlePrefetch={handlePrefetch} />
            <Table
                activeSort={activeSort}
                removeCity={removeCity}
                handleSort={handleSort}
                cityData={cityData}
                time={time}
                sortReverse={sortReverse}
            />
            <DatePicker times={times} timeIndex={time} handleTimeSet={handleTimeSet} />
        </>
    )


    return (
        <div className="flex flex-col items-center text-white">
            <Header />
            {
                // if (loading) show <Spinner /> else show Content
                loading ? <Spinner /> : content
            }
        </div>
    )
}

const CityForm = ({ handlePrefetch }) => {
    const [value, setValue] = useState('')
    const [error, setError] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (value === '') setError(true)
        else {
            handlePrefetch(value)
            setValue('');
        }
    }

    const handleInput = (e) => {
        setError(false);
        setValue(e.target.value)
    }

    const erorrClass = error ? 'border-red-600' : null

    return (
        <form onSubmit={handleSubmit} className='flex gap-4'>
            <input
                placeholder="New-York"
                className={`text-black py-2 px-3 outline-none rounded-lg transition-all border-4 ${erorrClass}`}
                type="text"
                value={value}
                onChange={handleInput}
            />
            <button className="bg-white rounded-lg text-black py-1 px-6 hover:bg-blue-900 hover:text-white border-2 hover:border-white  transition-all">Add</button>
        </form>
    )
}

// Date picker Component
const DatePicker = ({ times, handleTimeSet, timeIndex }) => {
    const dates = times.map((time, i) => {
        const activeClass = timeIndex == i ? 'bg-white text-black' : null

        return (
            <div key={i} onClick={() => handleTimeSet(i)} className={`font-bold rounded-md border-2	 py-1 px-4  cursor-pointer ${activeClass}`}>{time}</div>
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
const Table = ({ cityData, handleSort, removeCity, time, activeSort, sortReverse }) => {

    const cityRows = cityData.map((city, i) => {
        const { name, max, min, country } = city
        return (
            <ul key={i} className="table-block">
                <li className="font-semibold text-2xl py-2 px-4 flex items-center gap-2 flex-row-reverse">
                    {name} ({country})
                    <button onClick={() => removeCity(name)}>
                        <img src={removeIcon} alt="" />
                    </button>
                </li>
                <li className="font-semibold text-2xl py-2 px-4">{min[time]} °C</li>
                <li className="font-semibold text-2xl py-2 px-4">{max[time]} °C</li>
            </ul>
        )
    })

    const className = 'text-3xl font-semibold py-2 px-4 flex items-center gap-2';
    const imgClassASC = 'w-5 transition-transform';
    const imgClassDESC = 'w-5 transition-transform -rotate-180';
    const imgClass = `${imgClassASC} -rotate-90`;


    const array = [['City', 'name'], ['MinTemp', 'min'], ['MaxTemp', 'max']];

    return (
        <div className="w-2/3 mt-8 border p-4 rounded-2xl">
            <ul className="table-block">
                {
                    array.map((item, i) => {
                        const name = item[0];
                        const label = item[1];

                        return (
                            <button key={i} onClick={() => handleSort(label)} className={className}>
                                {name}
                                <img className={label === activeSort ? (sortReverse ? imgClassDESC : imgClassASC) : imgClass} src={dropdown} alt="sort-icon" />
                            </button>
                        )
                    })
                }
            </ul>
            {cityRows}
        </div>
    )
}


// Loader
const Spinner = () => {
    return (
        <div className="flex justify-center">
            <img src={spinner} alt="" />
        </div>
    )
}


export default App
