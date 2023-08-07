import React, { createContext, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

const NetworkContext = createContext(false);

const NetworkStateProvider = ({children}) => {
    const [connected, setConnected] = useState(false);

    const unsubscribe = NetInfo.addEventListener(state => {
        // Event listener triggers once registered - check state has changed to prevent rerender loop
        if (connected != state.isConnected) {
            unsubscribe;
            setConnected(state.isConnected);
        } 
    });

    return (
        <NetworkContext.Provider value={connected}>
            {children}
        </NetworkContext.Provider>
    )
}

export { NetworkContext, NetworkStateProvider };