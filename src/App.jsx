import {useEffect} from "react";
import {fetchWeather} from "./serverApi.js";

const App = () => {

    useEffect(() => {
        fetchWeather()
    }, [])

    return (
        <div className="flex flex-col items-center text-white">
            <h3 className="text-4xl font-semibold">
                Weather app
            </h3>
            <div className="w-2/3 mt-8 border p-4 rounded-2xl	">
                <ul className="flex justify-between	">
                    <li className="py-2 px-4">City</li>
                    <li className="py-2 px-4">MinTemp</li>
                    <li className="py-2 px-4">MaxTemp</li>
                </ul>
            </div>
        </div>
    )
}

export default App
