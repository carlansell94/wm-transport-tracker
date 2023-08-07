import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import SettingToggle from './toggle';
import SettingMultiOption from './multiOption';
import { SettingsStorage } from '../storage/storage';
import { isDarkTheme } from '../contexts/theme';

function SettingsContainer() {
    const darkTheme = isDarkTheme();
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const loadSettings = () => {
            const settingList = [];
            
            for (const key of SettingsStorage.getAllKeys()) {
                if (key === 'storageVersion') {
                    continue;
                }
                settingList.push({[key]: JSON.parse(SettingsStorage.getString(key))});
            }
    
            setSettings(settingList);
        }
        loadSettings();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={settings}
                renderItem={({item}) => {
                    const data = item[Object.keys(item)[0]];

                    // Check type of setting to render correct component
                    if (data.options) {
                        return <SettingMultiOption
                            index={Object.keys(item)[0]}
                            title={data.title}
                            values={data}
                            style={darkTheme ? darkStyles : styles}
                        />
                    } else {
                        return <SettingToggle
                            index={Object.keys(item)[0]}
                            title={data.title}
                            style={darkTheme ? darkStyles : styles}
                        />
                    }
                }}
                extraData={settings}
                keyExtractor={item => Object.keys(item)[0]}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    item: {
        margin: 10,
        borderRadius: 10,
        backgroundColor: 'white',
        flex: 1,
        paddingVertical: 20,
        paddingRight: 20,
        paddingLeft: 20
    },
    text: {
        fontSize: 20,
        flex: 1,
        color: '#333'
    }
});

const darkStyles = StyleSheet.create({
    item: {
        margin: 10,
        borderRadius: 10,
        backgroundColor: '#444',
        flex: 1,
        paddingVertical: 20,
        paddingRight: 20,
        paddingLeft: 20
        
    },
    text: {
        fontSize: 20,
        flex: 1,
        color: '#ccc'
    }
})

export default SettingsContainer;