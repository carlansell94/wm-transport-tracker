import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainNavigationContainer } from './src/containers/navigator';
import AboutContainer from './src/containers/about';
import SettingsContainer from './src/settings/settings';
import OperatorContainer from './src/containers/operator';
import { storageInit }  from './src/storage/storage.js';
import { ThemeValueProvider, isDarkTheme } from './src/contexts/theme';

const Navigation = () => {
    const Stack = createStackNavigator();
    const darkTheme = isDarkTheme();

    return (
        <NavigationContainer theme={darkTheme ? navDarkTheme : navTheme}>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShadowVisible: false,
                    headerStyle: {
                        backgroundColor: darkTheme ? '#222' : '#fff'
                    }
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={MainNavigationContainer}
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsContainer}
                />
                <Stack.Screen
                    name="About"
                    component={AboutContainer}
                />
                <Stack.Screen
                    name="Operators"
                    component={OperatorContainer}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Splash screen component displayed while initialising app
const SplashScreen = () => {
    const darkTheme = isDarkTheme();

    return (
        <View
            style={[
                styles.splashContainer,
                darkTheme && darkStyles.splashContainer
            ]}
        >
            <Image
                source={{uri: 'app_icon'}}
                style={styles.icon}
            />
            <Text style={[
                styles.text,
                darkTheme && darkStyles.text
            ]}>Transport Schedule</Text>
            <ActivityIndicator
                size="large"
                color={darkTheme ? '#9d5baf' : '#3c1053'}
            />
        </View>
    )
};

function App() {
    const [isInitialised, setIsInitialised] = useState(false);

    useEffect(() => {
        const storage = async() => {
            storageInit();
            setIsInitialised(true);
        }
        storage();
    }, []);

    return (
        <ThemeValueProvider>
            {isInitialised ? <Navigation /> : <SplashScreen />}
        </ThemeValueProvider>
    )
}

const styles = StyleSheet.create({
    splashContainer: {
        backgroundColor: '#f3f2f1',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        width: 120,
        height: 120
    },
    text: {
        marginTop: 15,
        marginBottom: 40,
        fontSize: 24
    }
});

const darkStyles = StyleSheet.create({
    splashContainer: {
        backgroundColor: '#333'
    },
    text: {
        color: '#ddd'
    }
});

const navTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#3c1053',
    },
};

const navDarkTheme = {
    dark: true,
    colors: {
        primary: '#9d5baf',
        background: '#333',
        card: 'rgb(255, 255, 255)',
        text: '#ccc',
        border: 'rgb(199, 199, 204)',
        notification: 'rgb(255, 69, 58)',
    },
};

export default App;