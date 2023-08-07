import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SettingsStorage } from '../storage/storage';
import { isDarkTheme } from '../contexts/theme';

const SettingMultiOption = ({index, title, values, style}) => {
    const darkTheme = isDarkTheme();
    const [value, setValue] = useState(values.current);
    const options = [];

    useEffect(() => {
        let settingValue = JSON.parse(SettingsStorage.getString(index));

        if (settingValue.current != value) {
            settingValue.current = value;
            SettingsStorage.set(index, JSON.stringify(settingValue));
        }
    }, [value]);

    for (const key of Object.keys(values.options)) {
        options.push({"key": key, "label": values.options[key]})
    }

    return (
        <View style={[
            style.item,
            styles.item
        ]}>
            <Text style={style.text}>{title}</Text>
            <Dropdown
                style={styles.dropdown}
                containerStyle={[
                    styles.picker,
                    darkTheme && darkStyles.dropdown
                ]}
                activeColor={darkTheme ? '#666' : '#ccc'}
                itemTextStyle={darkTheme ? darkStyles.text : styles.text}
                itemContainerStyle={styles.picker}
                selectedTextStyle={darkTheme ? darkStyles.text : styles.text}
                data={options}
                labelField="label"
                valueField="key"
                onChange={option => setValue(option.key)}
                value={value}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        color: '#333'
    },
    dropdown: {
        width: '40%'
    },
    picker: {
        borderRadius: 10,
        borderWidth: 0
    }
})

const darkStyles = StyleSheet.create({
    text: {
        color: '#ccc'
    },
    selected: {
        backgroundColor: '#666'
    },
    dropdown: {
        backgroundColor: '#555'
    }
})

export default SettingMultiOption;