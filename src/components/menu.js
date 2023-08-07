import React, {useState} from 'react';
import { Pressable, StyleSheet, View} from 'react-native';
import { Menu, MenuDivider, MenuItem } from 'react-native-material-menu';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { isDarkTheme } from '../contexts/theme';

const menuButton = () => {
    const darkTheme = isDarkTheme();
    const navigation = useNavigation();

    const [visible, setVisible] = useState(false);

    const navigateToPage = (page) => {
        setVisible(false);
        navigation.navigate(page);
    }

    return (
        <View>
            <Menu
                visible={visible}
                anchor={
                    <Pressable
                        onPress={() => setVisible(true)}
                        style={({pressed}) => [
                            styles.menuButton,
                            darkStyles.menuButton,
                            darkTheme ? (
                                pressed ? darkStyles.menuButtonOpen : darkStyles.menuButtonClosed
                            ) : (
                                pressed ? styles.menuButtonOpen : styles.menuButtonClosed
                            )
                        ]}>
                        <Icon
                            name="ellipsis-vertical"
                            size={25}
                            color={darkTheme ? darkStyles.menuText.color : styles.menuText.color}
                        />
                    </Pressable>
                }
                style={[
                    styles.menu,
                    darkTheme && darkStyles.menu
                ]}
                onRequestClose={() => setVisible(false)}
            >
                <MenuItem
                    onPress={() => navigateToPage('Operators')}
                    textStyle={[
                        styles.menuText,
                        darkTheme && darkStyles.menuText
                    ]}
                >Operators</MenuItem>
                <MenuDivider color={darkTheme ? '#999' : '#ddd'} />
                <MenuItem
                    onPress={() => navigateToPage('Settings')}
                    textStyle={[
                        styles.menuText,
                        darkTheme && darkStyles.menuText
                    ]}
                >Settings</MenuItem>
                <MenuItem
                    onPress={() => navigateToPage('About')}
                    textStyle={[
                        styles.menuText,
                        darkTheme && darkStyles.menuText
                    ]}
                >About</MenuItem>
            </Menu>
        </View>
    );
}

const styles = StyleSheet.create({
    menuButton: {
        padding: 15
    },
    menuButtonClosed: {
        backgroundColor: '#fff'
    },
    menuButtonOpen: {
        backgroundColor: '#ccc'
    },
    menuDivider: {
        color: '#ccc'
    },
    menuText: {
        color: '#000'
    }
})

const darkStyles = StyleSheet.create({
    menu: {
        backgroundColor: '#333',
    },
    menuButtonClosed: {
        backgroundColor: '#222'
    },
    menuButtonOpen: {
        backgroundColor: '#444'
    },
    menuText: {
        color: '#ccc'
    }
})

export default menuButton;