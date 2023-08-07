import { Alert, Platform, ToastAndroid } from 'react-native';

export const MessagePopup = (message, length) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, length ?? ToastAndroid.LONG)
    } else {
        Alert.alert(message);
    }
}

// Only applicable to Android
export const ShortMessagePopup = (message) => {
    MessagePopup(message, ToastAndroid.SHORT)
}