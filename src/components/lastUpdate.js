import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NetworkContext } from '../contexts/network';
import { isDarkTheme } from '../contexts/theme';

function LastUpdate({time}) {
    const darkTheme = isDarkTheme();
    const network = useContext(NetworkContext);

    return (
        <View style={styles.container}>
            <Text style={[
                styles.text,
                darkTheme && darkStyles.text,
                !network && styles.error
            ]}>
                <Icon
                    name={network ? 'wifi' : 'cloud-offline-outline'}
                    size={styles.text.fontSize + 4}
                />
                &nbsp;Updated: {time}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flexDirection: 'row'
    },
    text: {
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
        padding: 5
    },
    error: {
        color: '#ea0029'
    }
});

const darkStyles = StyleSheet.create({
    text: {
        color: '#ccc'
    }
});

export default LastUpdate;