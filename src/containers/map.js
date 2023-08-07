import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NetworkContext } from '../contexts/network';
import MapComponent from '../components/map';
import MessagePopup from '../components/message';
import tfwmApiRequest from '../api/tfwm';

const getStops = async(mapView, stopType) => {
    const mapDisplayBounds = await mapView?.current?.getMapBoundaries();

    if (!mapDisplayBounds || mapDisplayBounds.status === 'rejected') {
        return [];
    }

    try {
        const stopList = await tfwmApiRequest('http://api.tfwm.org.uk/StopPoint', {
            swLat: mapDisplayBounds.southWest.latitude,
            swLon: mapDisplayBounds.southWest.longitude,
            neLat: mapDisplayBounds.northEast.latitude,
            neLon: mapDisplayBounds.northEast.longitude,
            stopTypes: (stopType ?? 'NaptanMarkedPoint')
        });

        return stopList.StopPointsResponse.StopPoints.StopPoint;
    } catch {
        MessagePopup("Error fetching stop list, check your network connection.");
        return false;
    }
}

function MapContainer() {
    const mapView = React.useRef(null);
    const network = useContext(NetworkContext);
    const [stops, setStops] = useState([]);

    return (
        <View style={styles.container}>
            <MapComponent
                ref={mapView}
                style={styles.map}
                stops={stops}
                mapProps={{
                    showsUserLocation: true,
                    scrollEnabled: true,
                    rotateEnabled: false,
                    showsCompass: false,
                    minZoomLevel: 16,
                    zoomControlEnabled: true,
                    onMapReady: async function() {
                        network && setStops(await getStops(mapView))
                    },
                    onRegionChangeComplete: async function() {
                        network && setStops(await getStops(mapView))
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
  
export default MapContainer;