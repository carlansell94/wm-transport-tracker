import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import Icon from 'react-native-vector-icons/Ionicons';
import MapComponent from '../components/map';
import RouteCard from '../components/routeCard';
import { MessagePopup, ShortMessagePopup } from '../components/message';
import { FavouritesStorage } from '../storage/storage';
import BundledData from '../storage/data.json';
import { NetworkContext } from '../contexts/network';
import { isDarkTheme } from '../contexts/theme';
import tfwmApiRequest from '../api/tfwm';

const ActionButton = ({icon, text, route, params}) => {
    const navigation = useNavigation();
    const network = useContext(NetworkContext);
    const darkTheme = isDarkTheme();

    return (
        <Pressable
            onPress={() => {
                if (network) {
                    navigation.navigate(route, params)
                } else {
                    MessagePopup("Network connection unavailable.");
                }
            }}
            style={[
                styles.actionButton,
                styles.shadow,
                darkTheme && darkStyles.actionButton
            ]}
        >
            <Icon
                name={icon}
                size={26}
                color={darkTheme ? darkStyles.text.color : styles.altText.color}
            />
            <Text style={[
                styles.actionButtonText,
                styles.altText,
                darkTheme && darkStyles.text.color
            ]}>{text}</Text>
        </Pressable>
)}

const FavouriteButton = ({active, routeId, routeNumber, routeName, operatorId}) => {
    const [isActive, setIsActive] = useState(active);
    const darkTheme = isDarkTheme();
    const routeDetails = {
        'number': routeNumber,
        'name': routeName,
        'operatorId': operatorId
    }

    return (
        <Pressable
            onPress={() => {
                if (isActive) {
                    FavouritesStorage.delete(routeId);
                    ShortMessagePopup('Route removed from favourites');
                } else {
                    FavouritesStorage.set(routeId, JSON.stringify(routeDetails));
                    ShortMessagePopup('Route added to favourites');
                }

                setIsActive(!isActive);
            }}
            style={[
                styles.actionButton,
                styles.shadow,
                darkTheme && darkStyles.actionButton
            ]}
        >
            <Icon
                name={isActive ? 'heart' : 'heart-outline'}
                size={26}
                color={darkTheme ? darkStyles.text.color : styles.altText.color}
            />
            <Text style={[
                styles.actionButtonText,
                styles.altText,
                darkTheme && darkStyles.text.color
            ]}>{isActive ? 'Unfavourite' : 'Favourite'}</Text>
        </Pressable>
)}

const RouteMap = ({routeId}) => {
    const network = useContext(NetworkContext);
    const [stops, setStops] = useState([]);

    const routeStops = async() => {
        const stopList = await tfwmApiRequest('http://api.tfwm.org.uk/Line/'
            + routeId
            + '/StopPoints'
        );

        return stopList.ArrayOfStopPoint.StopPoint;
    }

    useEffect(() => {
        const mapUpdate = async() => {
            try {
                routeStops().then(stops => setStops(stops));   
            } catch {
                MessagePopup("Error fetching map data, check your network connection");
            }
        }

        if (network) {
            mapUpdate();
        } else {
            MessagePopup("Unable to load map, network connection unavailable.");
        }
    }, []);

    return (
        <View style={styles.container}>
            <MapComponent
                route={routeId}
                stops={stops}
                fitToElements={true}
                mapProps={{
                    showsUserLocation: false,
                    zoomControlEnabled: true
                }}
            />
        </View>
    )
}

function RouteContainer({navigation, route}) {
    const darkTheme = isDarkTheme();
    const {routeId, routeNumber, routeName, operatorId, operatorName, operatorColour} = route.params;
    const operators = BundledData.operators;

    useLayoutEffect(() => {
        if (route.params.favourite) {
            navigation.setOptions({
                headerLeft: () => (
                    <HeaderBackButton
                        onPress={() => navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }]
                          })
                        }
                    />
                )
            });
        }
    }, []);
    
    return (
        <View style={[
            styles.container,
            darkTheme && darkStyles.container
        ]}>
            <RouteMap routeId={routeId} />
            <RouteCard
                number={routeNumber}
                title={routeName}
                style={styles.itemContainer}
            />
            <View style={[
                styles.operator,
                darkTheme && darkStyles.container
            ]}>
                <Text style={[
                    styles.text,
                    darkTheme && darkStyles.text
                ]}>Operated By: </Text>
                <Text style={[
                    styles.operatorText,
                    styles.altText,
                    {backgroundColor: operators[operatorId].colour}
                ]}>{operators[operatorId].name}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <ActionButton
                    route={'RouteTimingContainer'}
                    params={{
                        'routeId': routeId,
                        'routeNumber': routeNumber,
                        'routeName': routeName,
                        'routeCardStyle': styles.itemContainer
                    }}
                    icon={'pulse'}
                    text={'Live Timing'}
                />
                <ActionButton
                    route={'AlertContainer'}
                    params={{
                        'routeId': routeId,
                        'routeNumber': routeNumber,
                        'routeName': routeName,
                        'routeCardStyle': styles.itemContainer
                    }}
                    icon={'warning-outline'}
                    text={'Alerts'}
                />
                <FavouriteButton
                    active={FavouritesStorage.contains(routeId)}
                    routeId={routeId}
                    routeNumber={routeNumber}
                    routeName={routeName}
                    operatorId={operatorId}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1
    },
    text: {
        color: '#333'
    },
    altText: {
        color: '#fff'
    },
    itemContainer: {
        padding: 10
    },
    buttonContainer: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    actionButton: {
        backgroundColor: '#3c1053',
        width: '30%',
        paddingVertical: 5,
        alignItems: 'center',
        borderRadius: 10
    },
    actionButtonText: {
        fontSize: 12
    },
    operator: {
        justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: 5
    },
    operatorText: {
        fontSize: 12,
        fontWeight: 'bold',
        borderRadius: 5,
        paddingHorizontal: 5
    },
    ...Platform.select({
        ios: {
            shadow: {
                shadowColor: 'black',
                shadowOffset: {width: 5, height: 5},
                shadowOpacity: 0.25,
                shadowRadius: 2
            }
        },
        android: {
            shadow: {
                elevation: 2,
                shadowColor: 'black'
            }
        }
    })
});

const darkStyles = StyleSheet.create({
    container: {
        backgroundColor: '#222'
    },
    text: {
        color: '#ccc'
    },
    actionButton: {
        backgroundColor: '#444',
        borderColor: '#444'
    }
});

export default RouteContainer;