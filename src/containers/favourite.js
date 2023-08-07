import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import RouteCard from '../components/routeCard';
import EmptyList from '../components/emptyList';
import { FavouritesStorage, addFavouritesListener } from '../storage/storage';
import BundledData from '../storage/data.json';
import { isDarkTheme } from '../contexts/theme';
import tfwmApiRequest from '../api/tfwm';

const ListHeader = ({darkTheme}) => (
    <View style={[
        styles.heading,
        styles.shadow,
        darkTheme && darkStyles.heading
    ]}>
        <Text style={[
            styles.headingText,
            darkTheme && darkStyles.text
        ]}>Your Favourite Routes</Text>
    </View>
)

function FavouriteContainer({navigation}) {
    const darkTheme = isDarkTheme();
    const [favourite, setFavourite] = useState([]);
    const [update, setUpdate] = useState(false);

    addFavouritesListener(setUpdate);

    useEffect(() => {
        const favouriteBuilder = [];
        const getFavourite = () => {
            const favouriteKeys = FavouritesStorage.getAllKeys();

            for (const key of favouriteKeys) {
                let value = JSON.parse(FavouritesStorage.getString(key));
                value['id'] = key;
                favouriteBuilder.push(value);
            }

            setFavourite(favouriteBuilder);
            setUpdate(false);
        }
        getFavourite();
    }, [update])

    return (
        <SafeAreaView style={styles.container}>
            <ListHeader
                darkTheme={darkTheme}
            />
            <FlatList
                ListEmptyComponent={<EmptyList icon='heart' text='You have no favourites' />}
                data={favourite}
                renderItem={({item}) => <FavouriteItem route={item} darkTheme={darkTheme} navigation={navigation} />}
                contentContainerStyle={favourite.length == 0 && styles.container}
            />
        </SafeAreaView>
    )
}

const FavouriteItem = ({route, darkTheme, navigation}) => {
    const operators = BundledData.operators;

    return (
        <>
            <Pressable
                style={[
                    styles.item,
                    darkTheme && darkStyles.item
                ]}
                onPress={async () => {
                    const response = await tfwmApiRequest('http://api.tfwm.org.uk/Line/'
                        + route.id
                        + '/Route/Sequence/inbound'
                    );

                    let fullRouteName = '';
                    let fullRouteLength = 0;

                    response.RouteSequence.OrderedLineRoutes.OrderedRoute.forEach(route => {
                        const length = route.NaptanIds.string.length;
                        if (length > fullRouteLength) {
                            fullRouteName = route.Name;
                            fullRouteLength = length;
                        }
                    });

                    routeInfo = {
                        "routeId": response.RouteSequence.LineId,
                        "routeNumber": response.RouteSequence.LineName.toUpperCase(),
                        "routeName": fullRouteName.replace(' to ', ' - '),
                        "operatorId": route.operatorId,
                        "favourite": true
                    };

                    headerLeft: () => (
                        <HeaderBackButton
                            onPress={() => navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }]
                              })
                            }
                        />
                    )

                    navigation.navigate('Search', {screen: 'RouteContainer', params: routeInfo});
                }}
            >
                <RouteCard 
                    number={route.number}
                    title={route.name}
                    tag={operators[route.operatorId]?.tag}
                    operatorStyle={{
                        backgroundColor: operators[route.operatorId]?.colour ?? '#777'
                    }}
                />
            </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        color: '#333'
    },
    heading: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingVertical: 20,
        marginBottom: 2
    },
    item: {
        backgroundColor: '#fff',
        gap: 15,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10
    },
    headingText: {
        fontSize: 20,
        flex: 1,
        color: '#000'
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
    heading: {
        backgroundColor: '#222'
    },
    item: {
        backgroundColor: '#444',
    },
    text: {
        color: '#ccc'
    }
});

export default FavouriteContainer;