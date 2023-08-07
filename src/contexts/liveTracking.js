import React, { createContext, useState, useEffect } from "react";

const LiveTrackingContext = createContext([]);

function getDateString(date) {
    return date.getHours()
        + ":"
        + String(date.getMinutes()).padStart(2, '0');
}

const LiveTrackingValueProvider = ({children}) => {
    const [journeys, setJourneys] = useState([]);
    const [lastUpdate, setLastUpdate] = useState(null);

    useEffect(() => {
        async function update() {
            setLastUpdate(getDateString(new Date()));
        };
        update();
    }, [journeys]);

    return (
        <LiveTrackingContext.Provider value={{journeys, setJourneys, lastUpdate}}>
            {children}
        </LiveTrackingContext.Provider>
    )
}

export { LiveTrackingContext, LiveTrackingValueProvider };