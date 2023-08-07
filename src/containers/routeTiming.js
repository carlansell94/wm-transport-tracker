import React, { useContext, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, SectionList, Pressable } from 'react-native';
import { isDarkTheme } from '../contexts/theme';
import { NetworkContext } from '../contexts/network';
import { useNavigation } from '@react-navigation/native';
import RouteCard from '../components/routeCard';
import Icon from 'react-native-vector-icons/Ionicons';
import LiveTiming from '../components/liveTiming';
import LastUpdate from '../components/lastUpdate';
import { LiveTrackingContext } from '../contexts/liveTracking';
import tfwmApiRequest from '../api/tfwm';
import { MessagePopup } from '../components/message';

function RouteTimingContainer({route}) {
    const darkTheme = isDarkTheme();
    const {routeId} = route.params;
    const network = useContext(NetworkContext);
    const {journeys, setJourneys, lastUpdate} = useContext(LiveTrackingContext);

    function dataSort(arrivalArray) {
        return arrivalArray.data.sort((a, b) => {
            if (a.arrivals[0].nextStopNo != b.arrivals[0].nextStopNo) {
                return b.arrivals[0].nextStopNo - a.arrivals[0].nextStopNo;
            } else {
                return new Date(a.arrivals[0].scheduled) - new Date(b.arrivals[0].scheduled);
            }
        });
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (network) {
                update();
            }
        }, 120000);

        update = async () => {
            const response = await tfwmApiRequest('http://api.tfwm.org.uk/Line/'
                + routeId
                + '/Arrivals'
            );
            const arrivals = response?.ArrayOfPrediction?.Prediction;

            if (!arrivals) {
                MessagePopup("Error fetching data, check your network connection.");
                return;
            }

            const directionList = [{
                'title': 'Inbound',
                'data': []
            },
            {
                'title': 'Outbound',
                'data': []
            }]

            const list = arrivals.reduce((acc, arrival) => {
                if (!acc[arrival.Id]) {
                    Object.assign(acc, {
                        [arrival.Id]: {
                            "id": arrival.Id,
                            "timestamp": arrival.Timestamp,
                            "destination": arrival.Towards,
                            "destinationStop": arrival.DestinationName,
                            "direction": arrival.Direction,
                            "vehicle": arrival.VehicleId,
                            "arrivals": []
                        }
                    });
                }

                acc[arrival.Id]['arrivals'].push({
                    "nextStopNo": arrival.StopSequence,
                    "nextStopName": arrival.StationName,
                    "scheduled": arrival.ScheduledArrival,
                    "predicted": arrival.ExpectedArrival,
                    "timeToArrival": arrival.TimeToStation
                });
                return acc;
            }, {});

            for (let key in list) {
                const index = list[key].direction === 'inbound' ? 0 : 1;                    
                directionList[index].data.push(list[key]);
            }

            dataSort(directionList[0]);
            dataSort(directionList[1]);

            setJourneys(directionList);
        }
        update();

        return () => {
            setJourneys([]);
            clearInterval(interval);
        }; 
    }, []);

    return (
        <SafeAreaView>
            <SectionList
                sections={journeys}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <RouteStop
                        details={item}
                        header={{
                            'routeNumber': route.params.routeNumber,
                            'routeName': route.params.routeName,
                            'style': route.params.routeCardStyle
                        }}
                    />
                )}
                ListHeaderComponent={
                    <>
                        <RouteCard
                            number={route.params.routeNumber}
                            title={route.params.routeName}
                            style={route.params.routeCardStyle}
                        />
                        {
                            lastUpdate &&
                            <LastUpdate time={lastUpdate} />
                        }
                    </>
                }
                renderSectionHeader={({section}) => {
                    if (section.data.length === 0) {
                        return (
                            <Text style={[
                                styles.timingHeading,
                                styles.emptyTimingHeading,
                                darkTheme && darkStyles.text,
                                darkTheme && darkStyles.emptyTimingHeading
                            ]}>No Upcoming {section.title} Journeys</Text>
                        )
                    } else {
                        return (
                            <Text style={[
                                styles.timingHeading,
                                darkTheme && darkStyles.text
                            ]}>{section.title}</Text>
                        )
                    }
                }}
            />
        </SafeAreaView>
    );
}

const RouteStop = ({header, details}) => {
    const darkTheme = isDarkTheme();
    const navigation = useNavigation();
    const {arrivals, destination} = details;
    
    const {nextStopNo, nextStopName} = arrivals[0];
    const nextStopScheduled = new Date(arrivals[0].scheduled);
    const destinationScheduled = new Date(arrivals[arrivals.length-1].scheduled);

    const isActive = () => {
        if (nextStopNo == 1) {
            const current = new Date();
            const diff = Math.round((nextStopScheduled - current) / 60000);

            if (diff > 2) {
                return false;
            }
        }

        return true;
    }

    return (
        <Pressable style={[
            styles.timingContainer,
            darkTheme && darkStyles.timingContainer
        ]}
            onPress={() => navigation.navigate('JourneyTimingContainer', {
                id: details.id,
                direction: (details.direction == 'inbound' ? 0 : 1),
                header: header
            })}
        >
            <View style={styles.journeyInfo}>
                <View style={styles.journeyScheduleInfo}>
                    <Text style={[
                        styles.text,
                        styles.destination,
                        darkTheme && darkStyles.text
                    ]}>{destination}</Text>
                    <Text style={[
                        styles.text,
                        styles.time,
                        darkTheme && darkStyles.text
                    ]}>
                        <Icon
                            name={'time'}
                            size={styles.liveStop.fontSize}
                            color={darkTheme ? darkStyles.text.color : styles.text.color}
                        /> {destinationScheduled.getHours()}:{String(destinationScheduled.getMinutes()).padStart(2, '0')}
                    </Text>
                </View>
                <View style={styles.liveInfo}>
                    {
                        isActive() !== false &&
                        <>
                            <Text style={[
                                styles.text,
                                styles.liveStop,
                                darkTheme && darkStyles.text
                            ]}>
                                <Icon
                                    name={'bus'}
                                    size={styles.liveStop.fontSize}
                                    color={darkTheme ? darkStyles.text.color : styles.text.color}
                                />
                                <Icon
                                    name={'arrow-forward'}
                                    size={styles.liveStop.fontSize}
                                    color={darkTheme ? darkStyles.text.color : styles.text.color}
                                />
                                {nextStopName} ({nextStopNo})
                            </Text>
                            <LiveTiming
                                scheduled={arrivals[0].scheduled}
                                predicted={arrivals[0].predicted}
                            />
                        </>
                    }
                    {
                        isActive() === false &&
                        <>
                            <Text style={[
                                styles.text,
                                styles.liveStop,
                                darkTheme && darkStyles.text
                            ]}>
                                Scheduled Departure: {nextStopScheduled.getHours()}:
                                {String(nextStopScheduled.getMinutes()).padStart(2, '0')}
                            </Text>
                        </>
                    }
                </View>
            </View>
            <View style={styles.arrow}>
                <Icon
                    name={'caret-forward'}
                    size={styles.liveStop.fontSize}
                    color={darkTheme ? darkStyles.text.color : styles.text.color}
                />
            </View>
        </Pressable>
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
    timingContainer: {
        backgroundColor: 'white',
        gap: 15,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        flexDirection: 'row'
    },
    arrow: {
        justifyContent: 'center'
    },
    journeyInfo: {
        flex: 1
    },
    journeyScheduleInfo: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        flex: 1,
        paddingBottom: 5
    },
    destination: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        flex: 1
    },
    time: {
        fontSize: 16,
        paddingVertical: 5,
    },
    liveInfo: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'
    },
    liveStop: {
        flex: 1,
        flexDirection: 'row',
        gap: 5,
        fontSize: 16
    },
    liveTime: {
        flex: 0,
        fontWeight: 'bold',
        backgroundColor: '#ea0029',
        padding: 5,
        borderRadius: 5
    },
    timingHeading: {
        marginHorizontal: 10,
        marginTop: 20,
        marginBottom: 10,
        fontSize: 18,
        color: '#000'
    },
    emptyTimingHeading: {
        padding: 10,
        backgroundColor: '#ff1a1a',
        borderRadius: 10,
        textAlign: 'center'
    }
});

const darkStyles = StyleSheet.create({
    timingContainer: {
        backgroundColor: '#444'
    },
    lastUpdate: {
        backgroundColor: '#222'
    },
    text: {
        color: '#ccc'
    },
    emptyTimingHeading: {
        backgroundColor: '#800000'
    }
});

export default RouteTimingContainer;