import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { isDarkTheme } from '../contexts/theme';

function EmptyList({icon, text}) {
    const darkTheme = isDarkTheme();

    return (
        <View style={styles.container}>
            <Icon
                name={icon}
                size={75}
                color={darkTheme ? darkStyles.text.color : styles.text.color}
            />
            <Text style={[
                styles.text,
                darkTheme && darkStyles.text
            ]}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15
    },
    text: {
        color: '#666',
        fontSize: 20
    }
});

const darkStyles = StyleSheet.create({
    text: {
        color: '#ccc'
    }
});

export default EmptyList;