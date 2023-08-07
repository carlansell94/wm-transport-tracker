import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import { isDarkTheme } from '../contexts/theme';
import RouteCard from '../components/routeCard';
import Icon from 'react-native-vector-icons/Ionicons';
import LiveTiming from '../components/liveTiming';
import { LiveTrackingContext } from '../contexts/liveTracking';
import EmptyList from '../components/emptyList';
import LastUpdate from '../components/lastUpdate';

function JourneyTimingContainer({route}) {    
    const darkTheme = isDarkTheme();
    const {journeys, lastUpdate} = useContext(LiveTrackingContext);
    const {id, direction} = route.params;

    const index = journeys[direction].data.map((journey) => {
        return journey.id;
    }).indexOf(id);

    const journey = journeys[direction]?.data[index]?.arrivals ?? [];

    return (
        <SafeAreaView>
            <FlatList
                data={journey}
                keyExtractor={(item) => item.nextStopNo}
                renderItem={({item, index}) => (
                    <Stop
                        details={item}
                        lastItem={index == journey.length - 1}
                    />
                )}
                contentContainerStyle={journey.length == 0 && { height: '100%' }}
                ListHeaderComponent={
                    <>
                        <RouteCard
                            number={route.params.header.routeNumber}
                            title={route.params.header.routeName}
                            style={route.params.header.style}
                        />
                        {
                            journey.length > 0 &&
                            <View style={styles.container}>
                                <View style={styles.stopSequence}>
                                    <View style={[
                                        styles.stopSequenceStrip,
                                        styles.stopSequenceStart
                                    ]}/>
                                    <Text style={[
                                        styles.stopSequenceText,
                                        darkTheme && darkStyles.container
                                    ]}>
                                        
                                        <Icon
                                            name={'bus'}
                                            size={styles.stopSequenceText.fontSize}
                                            color={darkTheme ? darkStyles.text.color : styles.text.color}
                                        />
                                    </Text>
                                </View>
                                <View style={styles.topContainer}>
                                    <LiveTiming
                                        scheduled={journey[0].scheduled}
                                        predicted={journey[0].predicted}
                                    />
                                    <LastUpdate time={lastUpdate} />
                                </View>
                            </View>
                        }
                    </>
                }
                ListEmptyComponent={<EmptyList icon='bus' text='Journey Complete' />}               
            />
        </SafeAreaView>
    )
}

const Stop = ({details, lastItem}) => {
    const darkTheme = isDarkTheme();
    const {nextStopName, nextStopNo, predicted, scheduled} = details;
    const destinationScheduled = new Date(scheduled);

    return (
        <View style={styles.container}>
            <View style={styles.stopSequence}>
                <View style={[
                    styles.stopSequenceStrip,
                    lastItem && styles.stopSequenceEnd
                ]} />
                <Text style={[
                    styles.stopSequenceText,
                    styles.text,
                    darkTheme && darkStyles.container,
                    darkTheme && darkStyles.text
                ]}>
                    {nextStopNo}
                </Text>
            </View>
            <View style={[
                styles.stopContainer,
                darkTheme && darkStyles.container
            ]}>
                <View style={styles.stopInfo}>
                    <Text style={[
                        styles.text,
                        styles.destination,
                        darkTheme && darkStyles.text
                    ]}>{nextStopName}</Text>
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
        flexDirection: 'row'
    },
    text: {
        color: '#333'
    },
    stopContainer: {
        backgroundColor: 'white',
        gap: 15,
        padding: 10,
        marginRight: 10,
        marginVertical: 5,
        borderRadius: 10,
        flexDirection: 'row',
        flex: 1
    },
    stopSequence: {
        width: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    stopSequenceStrip: {
        width: 8,
        backgroundColor: '#d4351c',
        justifyContent: 'center',
        position: 'absolute',
        height: '100%'
    },
    stopSequenceStart: {
        height: '50%',
        bottom: 0
    },
    stopSequenceEnd: {
        height: '50%',
        top: 0
    },
    stopSequenceBar: {
        height: 8,
        width: '80%',
        bottom: 11
    },
    stopSequenceText: {
        zIndex: 2,
        elevation: 2,
        width: 30,
        height: 30,
        backgroundColor: 'white',
        borderRadius: 15,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        textAlignVertical: 'center',
        borderWidth: 2,
        borderColor: '#ea0029'
    },
    topContainer: {
        alignItems: 'center',
        justifyContent: 'space-around',
        flex: 1,
        height: 50,
        flexDirection: 'row'
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
        fontWeight: 'bold',
        flex: 1
    },
    time: {
        fontSize: 14,
        paddingVertical: 5
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

export default JourneyTimingContainer;