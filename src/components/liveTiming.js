import { StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { isDarkTheme } from '../contexts/theme';

function getMinsDifference(predicted, scheduled) {
    if (isNaN(predicted)) {
        return false;
    }

    return parseInt((predicted - scheduled) / 60000);
}

function getStatusColour(difference) {
    const darkTheme = isDarkTheme();

    if (difference === false) {
        return darkTheme ? '#333' : '#ddd';
    } else if (difference > 0) {
        return darkTheme ? '#800000' : '#ff1a1a'
    } else if (difference < 0) {
        return darkTheme ? '#997300' : '#ffdd00'
    } else {
        return darkTheme ? '#006622' : '#33cc33'
    }
}

const LiveTiming = ({scheduled, predicted, time}) => {
    scheduled = new Date(scheduled);
    predicted = new Date(predicted);
    const darkTheme = isDarkTheme();
    const minsDifference = getMinsDifference(predicted, scheduled);

    const status = () => {
        if (minsDifference === false) {
            return "Tracking Unavailable";
        }

        if (minsDifference === 0) {
            return "On Time"
        }
        
        let statusString = "min";

        if (Math.abs(minsDifference) > 1) {
            statusString += "s"
        }

        if (minsDifference > 0) {
            statusString += " late";
        } else {
            statusString += " early";
        }

        return Math.abs(minsDifference) + " " + statusString;
    }

    const value = (() => {
        if (time) {
            return " " + predicted.getHours() + ":" + String(predicted.getMinutes()).padStart(2, '0');
        }

        return " " + status();
    })();

    return (
        <Text style={[
            styles.text,
            styles.liveTime,
            darkTheme && darkStyles.text,
            {backgroundColor: getStatusColour(minsDifference)}
        ]}>
            {
                !isNaN(predicted) &&
                <Icon
                    name={'pulse'}
                    size={styles.liveTime.fontSize}
                    color={darkTheme ? darkStyles.text.color : styles.text.color}
                />
            }
            {value}
        </Text>
    )
}

const styles = StyleSheet.create({
    text: {
        color: '#333'
    },
    liveTime: {
        flex: 0,
        fontWeight: 'bold',
        padding: 5,
        borderRadius: 5,
        fontSize: 14
    },
});

const darkStyles = StyleSheet.create({
    text: {
        color: '#ccc'
    }
});

export default LiveTiming;