import React, { useEffect, useState }from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import { isDarkTheme } from '../contexts/theme';
import { useNavigation } from '@react-navigation/native';
import { darkMapStyle } from '../storage/googleMapsThemes';

const currentLocation = () => {
    const [location, setLocation] = useState([52.4798, -1.8927]);   // Fallback default in the West Midlands
  
    useEffect(() => {
        const getLocation = async() => {
            Geolocation.requestAuthorization(
                (success) => {},
                (error) => {
                    return;     // Location not required on this screen
                }
            );

            Geolocation.getCurrentPosition(info => {
                setLocation([info.coords.longitude, info.coords.latitude]);
            }, (error) => {},
            {
                enableHighAccuracy: true,
            })
        }     
        getLocation();
    }, [])
  
    return location;
}

function getStopMarkers(navigation, stops, darkTheme) {
    return stops.map((stopInfo) => (
        <Marker
            key={stopInfo.NaptanId}
            title={stopInfo.CommonName}
            coordinate={{
                latitude: stopInfo.Lat,
                longitude: stopInfo.Lon
            }}>
            <Icon
                name="bus" 
                color={darkTheme ? darkStyles.text.color : styles.text.color}
                size={5}
            />
            <Callout
                tooltip={true}
                onPress={() => {
                    navigation.navigate('Search', {
                        screen: 'StopTimingContainer',
                        params: {
                            'stopId' : stopInfo.NaptanId,
                            'stopName': stopInfo.CommonName
                        }
                    }
                )}}
            >
                <View style={[
                    styles.popupBox,
                    darkTheme && darkStyles.popupBox
                ]}>
                    <Text style={[
                        styles.text,
                        styles.popupBoxText,
                        darkTheme && darkStyles.text
                    ]}>{stopInfo.CommonName}</Text>
                    <Text style={[
                        styles.popupBoxButtonText
                    ]}>View Live Timing</Text>
                </View>
            </Callout>
        </Marker>
    ));
}

const MapComponent = React.forwardRef((props, ref) => {
    const mapView = ref ?? React.useRef(null);
    const navigation = useNavigation();
    const location = currentLocation();
    const darkTheme = isDarkTheme();

    const {stops} = props;
    const [mapMarkers, setMapMarkers] = useState([]);

    useEffect(() => {
        async function updateMap() {
            setMapMarkers(getStopMarkers(navigation, stops, darkTheme));
            await new Promise(resolve => setTimeout(resolve, 10 || DEF_DELAY));
            (props.fitToElements && mapView.current.fitToElements());
        }
        updateMap();
    }, [stops])
  
    return (
        <MapView
            ref={mapView}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={{
                latitude: location[1],
                longitude: location[0],
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            }}
            customMapStyle={darkTheme && darkMapStyle}
            {...props.mapProps}
        >
            {mapMarkers}
        </MapView>
    );
});
  
const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    text: {
        color: '#333'
    },
    popupBox: {
        width: 200,
        borderWidth: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderColor: '#fff'
    },
    popupBoxText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5
    },
    popupBoxButtonText: {
        backgroundColor: '#3c1053',
        padding: 5,
        textAlign: 'center',
        marginVertical: 5,
        borderRadius: 5,
        color: 'white',
        textAlign: 'center'
    }
});

const darkStyles = StyleSheet.create({
    text: {
        color: '#ccc'
    },
    popupBox: {
        backgroundColor: '#444',
        borderColor: '#444'
    },
    popupBoxButtonText: {
        backgroundColor: '#9d5baf'
    }
});

export default MapComponent;