import React from 'react';
import { Image, Linking, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { isDarkTheme } from '../contexts/theme';

function AboutContainer() {
    const darkTheme = isDarkTheme();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Image
                    source={{uri: 'app_icon'}}
                    style={styles.icon}
                />
                <Text style={[
                    styles.text,
                    styles.heading,
                    darkTheme && darkStyles.text
                ]}>WM Transport Tracker</Text>
                <Text style={[
                    styles.text,
                    styles.version,
                    darkTheme && darkStyles.text
                ]}>v0.1</Text>
                <Text style={[
                    styles.text,
                    styles.sources,
                    darkTheme && darkStyles.text
                ]}>Find and track bus and tram routes across the West Midlands.</Text>
                <Text style={[
                    styles.text,
                    styles.sources,
                    darkTheme && darkStyles.text
                ]}>This app uses data from the Transport for West Midlands (TfWM) API.</Text>
            </View>
            <>
                <Pressable
                    style={darkTheme && darkStyles.github}
                    onPress={() => Linking.openURL('https://github.com/carlansell94/wm-transport-tracker')}
                >
                    <Image
                        source={{uri: 'github'}}
                        style={styles.githubIcon}
                    />
                </Pressable>
            </>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    text: {
        color: '#333'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    icon: {
        width: 120,
        height: 120
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8
    },
    version: {
        fontSize: 20,
        marginBottom: 50
    },
    sources: {
        marginTop: 20,
        textAlign: 'center'
    },
    githubIcon: {
        height: 40,
        width: 40
    }
});

const darkStyles = StyleSheet.create({
    text: {
        color: '#ccc'
    },
    github: {
        backgroundColor: '#ccc',
        borderRadius: 25,
        padding: 5
    }
});

export default AboutContainer;