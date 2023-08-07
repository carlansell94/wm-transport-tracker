import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { isDarkTheme } from '../contexts/theme';

const RouteCard = ({number, title, tag, operatorStyle, style}) => {
    const darkTheme = isDarkTheme();

    return (
        <View style={[styles.container, style]}>
            <View style={styles.routeNo}>
                <Text style={styles.routeNoText}>{number}</Text>
            </View>
            <View style={styles.routeInfo}>
                <Text style={[
                    styles.text,
                    styles.routeName,
                    darkTheme && darkStyles.text
                ]}>{title}</Text>
                
            </View>
            {
                tag && 
                <View style={styles.operatorTag}>
                    <Text style={[
                        styles.operatorTagText,
                        operatorStyle,
                        darkTheme && darkStyles.text
                    ]}>{tag}</Text>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 15
    },
    text: {
        fontSize: 20,
        flex: 1,
        color: '#333'
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
        gap: 5
    },
    routeName: {
        verticalAlign: 'middle'
    },
    operatorTag: {
        justifyContent: 'center',
    },
    operatorTagText: {
        color: '#fff',
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
    text: {
        color: '#ccc'
    }
});

export default RouteCard;