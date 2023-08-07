import { useContext, useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NetworkContext } from '../contexts/network';
import BundledData from '../storage/data.json';
import LiveTiming from '../components/liveTiming';
import LastUpdate from '../components/lastUpdate';
import MessagePopup from '../components/message';
import { isDarkTheme } from '../contexts/theme';
import { LiveTrackingContext } from '../contexts/liveTracking';
import tfwmApiRequest from '../api/tfwm';

async function getStopTiming(stopId) {
    try {
        const response = await tfwmApiRequest('http://api.tfwm.org.uk/StopPoint/'
            + stopId
            + '/Arrivals'
        );
        const arrivals = response.Predictions.Prediction.map((arrival) => {
            return {
                'id': arrival.Id,
                'lineId': arrival.LineId,
                'number': String(arrival.LineName).toUpperCase(),
                'operatorId': arrival.Operator.Id,
                'destination': arrival.Towards,
                'scheduled': arrival.ScheduledArrival,
                'predicted': arrival.ExpectedArrival
            }
        });

        return arrivals.sort((a, b) => (new Date(a.predicted) - new Date(b.predicted)));
    } catch {
        MessagePopup("Error fetching data, check your network connection.");
    }
}

function StopTimingContainer({route}) {
    const darkTheme = isDarkTheme();
    const network = useContext(NetworkContext);
    const {stopId, stopName} = route.params;
    const {journeys, setJourneys, lastUpdate} = useContext(LiveTrackingContext);

    useEffect(() => {
        const interval = setInterval(() => {
            if (network) {
                update();
            }
        }, 120000);

        async function update() {
            setJourneys(await getStopTiming(stopId));
        }

        if (network) {
            update();
        } else {
            MessagePopup("Error fetching data, check your network connection.");
        }

        return () => {
            setJourneys([]);
            clearInterval(interval);
        }
    }, []);

    return (
        <SafeAreaView>
            <FlatList
                data={journeys}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <Route details={item} />
                )}
                ListHeaderComponent={
                    <>
                        <View style={[
                            styles.container,
                            styles.headerContainer
                        ]}>
                            <View style={[
                                styles.container,
                                styles.stopNameContainer
                            ]}>
                                <Icon
                                    name="location"
                                    size={styles.headerText.fontSize+10}
                                    color={darkTheme ? darkStyles.text.color : styles.text.color}
                                />
                                <Text style={[
                                    styles.text,
                                    styles.headerText,
                                    darkTheme && darkStyles.text
                                ]}>{stopName}</Text>
                            </View>{
                            lastUpdate &&
                            <LastUpdate time={lastUpdate} />
                        }
                        </View>
                        
                    </>
                }
            />
        </SafeAreaView>
    );
}

const Route = ({details}) => {
    const darkTheme = isDarkTheme();
    const {number, destination, predicted, scheduled, operatorId} = details;
    const destinationScheduled = new Date(scheduled);
    const operators = BundledData.operators;

    return (
        <View style={styles.container}>
            <View style={[
                styles.stopContainer,
                darkTheme && darkStyles.container
            ]}>
                <View style={styles.stopInfo}>
                    <View style={styles.routeNo}>
                        <Text style={styles.routeNoText}>{number}</Text>
                    </View>
                    <View style={styles.routeInfo}>
                        <Text style={[
                            styles.text,
                            styles.destination,
                            darkTheme && darkStyles.text
                        ]}>{destination}</Text>
                        <Text style={[
                            styles.operatorText,
                            {backgroundColor: operators[operatorId].colour}
                        ]}>{operators[operatorId].name}</Text>
                    </View>
                    <View style={styles.stopTimes}>
                        <Text style={[
                            styles.text,
                            styles.time,
                            darkTheme && darkStyles.text
                        ]}>
                            <Icon
                                name={'calendar'}
                                size={styles.time.fontSize}
                                color={darkTheme ? darkStyles.text.color : styles.text.color}
                            /> {destinationScheduled.getHours()}:{String(destinationScheduled.getMinutes()).padStart(2, '0')}
                        </Text>
                        {
                            !predicted == "" &&
                            <LiveTiming
                                scheduled={scheduled}
                                predicted={predicted}
                                time={true}
                            />
                        }
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    text: {
        color: '#333'
    },
    headerContainer: {
        padding: 20,
        gap: 15,
        justifyContent: 'center',
        flexDirection: 'column'
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    stopNameContainer: {
        alignItems: 'center',
        gap: 10
    },
    stopContainer: {
        backgroundColor: '#fff',
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        flex: 1
    },
    stopInfo: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        flex: 1
    },
    stopTimes: {
        alignItems: 'center'
    },
    destination: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    time: {
        fontSize: 14,
        paddingVertical: 5
    },
    routeNo: {
        backgroundColor: 'black',
        alignItems: 'center',
        paddingVertical: 12,
        width: 75,
        borderRadius: 10
    },
    routeNoText: {
        color: 'yellow',
        fontSize: 24
    },
    routeInfo: {
        flex: 1,
        gap: 10
    },
    operatorText: {
        fontSize: 12,
        fontWeight: 'bold',
        borderRadius: 5,
        paddingHorizontal: 5,
        color: '#fff',
        alignSelf: "flex-start"
    }
});

const darkStyles = StyleSheet.create({
    container: {
        backgroundColor: '#444'
    },
    text: {
        color: '#ccc'
    }
});

export default StopTimingContainer;