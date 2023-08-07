import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import MapContainer from './map';
import FavouriteContainer from './favourite';
import SearchContainer from './search';
import RouteContainer from './route';
import AlertContainer from './alert';
import RouteTimingContainer from './routeTiming';
import JourneyTimingContainer from './journeyTiming';
import StopTimingContainer from './stopTiming';
import menuButton from '../components/menu';
import { NetworkStateProvider } from '../contexts/network';
import { LiveTrackingValueProvider } from '../contexts/liveTracking';
import { isDarkTheme } from '../contexts/theme';

function MainNavigationContainer() {
    const Tab = createBottomTabNavigator();
    const darkTheme = isDarkTheme();

    const TabNavigatorIcon = ({name}) => {
        return <Icon
            size={20}
            name={name}
            color={darkTheme ? '#ccc' : '#333'}
        />
    }

    return (
        <NetworkStateProvider>
            <Tab.Navigator
                initialRouteName='Main'
                screenOptions={{
                    headerRight: menuButton,
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: darkTheme ? '#222' : '#fff'
                    },
                    tabBarStyle: {
                        backgroundColor: darkTheme ? '#333' : '#fff'
                    }
                }}
                
            >
                <Tab.Screen
                    name="Map"
                    component={MapContainer}
                    options={{
                        tabBarIcon: () => <TabNavigatorIcon name="map" />
                    }}
                />
                <Tab.Screen
                    name="Main"
                    component={FavouriteContainer}
                    options={{
                        tabBarIcon: () => <TabNavigatorIcon name="home" />,
                        title: "Home"
                    }}
                />
                <Tab.Screen
                    name="Search"
                    component={RouteNavigationContainer}
                    options={{
                        tabBarIcon: () => <TabNavigatorIcon name="search" />,
                        headerShown: false
                    }}
                />
            </Tab.Navigator>
        </NetworkStateProvider>
    )
}

function RouteNavigationContainer() {
    const RouteNavigator = createStackNavigator();

    return (
        <LiveTrackingValueProvider>
            <RouteNavigator.Navigator
                initialRouteName='SearchPage'
                screenOptions={{
                    headerRight: menuButton,
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: isDarkTheme() ? '#222' : '#fff'
                    }
                }}
            >
                <RouteNavigator.Screen
                    name="SearchContainer"
                    component={SearchContainer}
                    options={{ title: 'Search' }}
                />
                <RouteNavigator.Screen 
                    name="RouteContainer"
                    component={RouteContainer}
                    options={{ title: 'Route' }}
                />
                <RouteNavigator.Screen 
                    name="AlertContainer"
                    component={AlertContainer}
                    options={{ title: 'Service Alerts' }}
                />
                <RouteNavigator.Screen 
                    name="RouteTimingContainer"
                    component={RouteTimingContainer}
                    options={{ title: 'Live Route Timing' }}
                />
                <RouteNavigator.Screen
                    name="JourneyTimingContainer"
                    component={JourneyTimingContainer}
                    options={{ title: 'Live Journey Timing' }}
                />
                <RouteNavigator.Screen
                    name="StopTimingContainer"
                    component={StopTimingContainer}
                    options={{ title: 'Live Stop Timing' }}
                />
            </RouteNavigator.Navigator>
        </LiveTrackingValueProvider>
    );
}

export { MainNavigationContainer, RouteNavigationContainer }