import React, {useState} from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';

const SettingToggle = ({title, style}) => {
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <View style={[
            style.item,
            style.shadow,
            toggleStyles.item
        ]}>
            <Text style={style.text}>{title}</Text>
            <Switch
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
            />
        </View>
    );
};

const toggleStyles = StyleSheet.create({
    item: {
        flexDirection: 'row'
    }
})

export default SettingToggle;