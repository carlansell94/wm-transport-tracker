import React, { useEffect, useState, useContext } from 'react';
import { ActivityIndicator, FlatList, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import RouteCard from '../components/routeCard';
import EmptyList from '../components/emptyList';
import MessagePopup from '../components/message';
import tfwmApiRequest from '../api/tfwm';
import BundledData from '../storage/data.json';
import { isDarkTheme } from '../contexts/theme';
import { NetworkContext } from '../contexts/network';

function SearchContainer({navigation}) {
    const darkTheme = isDarkTheme();
    const network = useContext(NetworkContext);

    const [routeList, setRouteList] = useState(null);
    const [inputTerm, setInputTerm] = useState("");
    const [searchedTerm, setSearchedTerm] = useState(false);

    useEffect(() => {
        getSearchResults = async () => {
            try {
                const routeList = [];
                const routes = await tfwmApiRequest('http://api.tfwm.org.uk/Line/Search/' + searchedTerm);

                for (const route of routes.RouteSearchResponse.SearchMatches.RouteSearchMatch) {
                    const lines = await tfwmApiRequest('http://api.tfwm.org.uk/Line/'
                        + route.LineId
                        + '/Route/Sequence/inbound'
                    );

                    routeList.push({
                        "routeId": lines.RouteSequence.LineId,
                        "routeNumber": lines.RouteSequence.LineName.toUpperCase(),
                        "routeName": getFullRouteName(lines),
                        "operatorId": route.Operators.Operator[0].Id
                    });
                }
                setRouteList(routeList);
            } catch {
                MessagePopup("Error fetching search results, check your network connection.");
                setRouteList([]);
            }
        }

        function getFullRouteName(lines) {
            let fullRouteName = '';
            let fullRouteLength = 0;
    
            lines.RouteSequence.OrderedLineRoutes.OrderedRoute.forEach(route => {
                const length = route.NaptanIds.string.length;
                if (length > fullRouteLength) {
                    fullRouteName = route.Name;
                    fullRouteLength = length;
                }
            });
    
            return fullRouteName.replace(' to ', ' - ');
        }

        if (network && searchedTerm) {
            getSearchResults();
        }
    }, [searchedTerm])


    const ListHeader = () => (
        <View style={styles.header}>
            <Text style={[
                styles.text,
                styles.largeText,
                darkTheme && darkStyles.text
            ]}>Search Results For: {searchedTerm}</Text>
            <Pressable
                style={[
                    styles.button,
                    styles.clearButton,
                    darkTheme && darkStyles.button
                ]}
                onPress={() => {
                    setSearchedTerm(false)
                    setRouteList(null)
                }}
            >
                <Text style={[
                    styles.text,
                    darkStyles && darkStyles.text
                ]}>Clear</Text>
            </Pressable>
        </View>
    )


    const ListStatus = () => (
        <View style={styles.noResult}>
            {searchedTerm && !routeList &&
                <ActivityIndicator
                    size="large"
                    color={darkTheme ? darkStyles.button.backgroundColor : styles.button.backgroundColor}
                />
            }
            {searchedTerm && routeList &&
                <EmptyList icon='bus' text={'No results found for "' + searchedTerm + '"'} />
            }
            {!searchedTerm && network &&
                <EmptyList icon='search-outline' text='Enter a search term' />
            }
            {!searchedTerm && !network &&
                <EmptyList icon='cloud-offline-outline' text='Network unavailable' />
            }
        </View>
    )

    const submit = () => {
        if (network) {
            setRouteList(null);
            setSearchedTerm(inputTerm);
            setInputTerm("");
        } else {
            MessagePopup("Network connection unavailable.");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[
                styles.textInputContainer,
                styles.shadow,
                darkTheme && darkStyles.textInputContainer
            ]}>
                <TextInput 
                    style={[
                        styles.inputbox,
                        styles.text,
                        darkTheme && darkStyles.inputbox,
                        darkTheme && darkStyles.text
                    ]}
                    placeholder='Enter a Route'
                    placeholderTextColor={darkTheme ? darkStyles.text.color : styles.text.color}
                    value={inputTerm}
                    clearButtonMode={'always'}
                    onSubmitEditing={() => submit()}
                    onChangeText={text => setInputTerm(text)}
                />
                <Pressable
                    onPress={() => submit()}
                    style={[
                        styles.button,
                        styles.searchButton,
                        styles.shadow,
                        darkTheme && darkStyles.button
                    ]}
                >
                    <Icon
                        name="search-circle-outline"
                        color={'white'}
                        size={30}
                    />
                </Pressable>
            </View>
            <FlatList
                data={routeList}
                ListHeaderComponent={routeList && routeList.length !== 0 && <ListHeader />}
                ListEmptyComponent={<ListStatus />}
                keyExtractor={item => item.routeId}
                renderItem={({item}) => (
                    <SearchResult
                        navigation={navigation}
                        route={item}
                    />
                )}
                contentContainerStyle={[
                    styles.shadow,
                    (!routeList || routeList.length === 0) && styles.container
                ]}
            />
        </SafeAreaView>
    );
}

function SearchResult({navigation, route}) {
    const darkTheme = isDarkTheme();
    const operators = BundledData.operators;

    return (
        <Pressable
            style={[
                styles.item,
                darkTheme && darkStyles.item
            ]} 
            onPress={()=>navigation.navigate("RouteContainer", {...route})}
        >
            <RouteCard
                number={route.routeNumber}
                title={route.routeName}
                tag={operators[route.operatorId]?.tag}
                operatorStyle={{
                    backgroundColor: operators[route.operatorId]?.colour ?? '#777'
                }}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        color: '#333'
    },
    textInputContainer: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        gap: 20
    },
    inputbox: {
        paddingHorizontal: 15,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#bbb',
        backgroundColor: '#f8f8f8',
        flex: 1,
        fontSize: 20
    },
    button: {
        backgroundColor: '#3c1053',
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderRadius: 10
    },
    searchButton: {
        height: 50
    },
    clearButton: {
        height: 30
    },
    header: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    largeText: {
        fontSize: 20
    },
    noResult: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15
    },
    item: {
        backgroundColor: 'white',
        gap: 15,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10
    },
    icon: {
        color: '#777'
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
    text: {
        color: '#ccc'
    },
    textInputContainer: {
        backgroundColor: '#222'
    },
    button: {
        backgroundColor: '#9d5baf',
    },
    icon: {
        color: '#ddd'
    },
    inputbox: {
        borderColor: '#444',
        backgroundColor: '#484848'
    },
    item: {
        backgroundColor: '#444',
    }
});

export default SearchContainer;