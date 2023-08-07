import React, { useContext, useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { RenderHTML } from 'react-native-render-html';
import Icon from 'react-native-vector-icons/Ionicons';
import RouteCard from '../components/routeCard';
import { isDarkTheme } from '../contexts/theme';
import { NetworkContext } from '../contexts/network';
import { MessagePopup } from '../components/message';
import tfwmApiRequest from '../api/tfwm';

function AlertContainer({route}) {
    const {routeId, routeNumber, routeName, routeCardStyle} = route.params;
    const network = useContext(NetworkContext);
    const [routeAlerts, setRouteAlerts] = useState([]);

    useEffect(() => {
        getAlerts = async () => {
            try {
                const response = await tfwmApiRequest('http://api.tfwm.org.uk/Line/'
                    + routeId
                    + '/Disruption'
                );

                const alerts = response.ArrayOfDisruption.Disruption;
                
                setRouteAlerts(alerts.map(alert => {
                    return {
                        "category": alert.Category,
                        "description": alert.Description
                    }
                }));
            } catch {
                MessagePopup("Error fetching route alerts, check your network connection")
            }
        }

        if (network) {
            getAlerts();
        }
    }, []);

    return (
        <SafeAreaView>
            <FlatList
                data={routeAlerts}
                renderItem={({item}) => (
                    <Event
                        category={item.category}
                        text={item.description}
                    />)}
                ListHeaderComponent={
                    <RouteCard
                        number={routeNumber}
                        title={routeName}
                        style={routeCardStyle}
                    />
                }
            />
        </SafeAreaView>
    );
}

const Event = ({category, text}) => {
    const darkTheme = isDarkTheme();
    const { width } = useWindowDimensions();

    return (
        <View style={[
            styles.alertContainer,
            darkTheme && darkStyles.alertContainer
        ]}>
            <View style={styles.alertType}>
                <Icon
                    name={category === 'warning' ? 'warning' : 'information-circle-outline'} 
                    color={darkTheme ? 'yellow' : '#cccc00'}
                    size={30}
                />
            </View>
            <View style={styles.alertInfo}>
                <RenderHTML
                    contentWidth={width}
                    source={{
                        html: text
                    }}
                    baseStyle={darkTheme ? darkStyles.text : styles.text}
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
    date: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5
    },
    alertContainer: {
        backgroundColor: '#fff',
        gap: 15,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        flexDirection: 'row'
    },
    alertType: {
        justifyContent: 'center'
    },
    alertInfo: {
        flex: 1
    }
});

const darkStyles = StyleSheet.create({
    alertContainer: {
        backgroundColor: '#444'
    },
    text: {
        color: '#ccc'
    }
});

export default AlertContainer;