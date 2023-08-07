import { MMKV } from 'react-native-mmkv';
import RNFS from 'react-native-fs';
import StorageDefaults from './init.json';

const SettingsStorage = new MMKV({
    id: 'settings',
    path: RNFS.DocumentDirectoryPath + '/mmkv/settings'
});

const FavouritesStorage = new MMKV({
    id: 'favourites',
    path: RNFS.DocumentDirectoryPath + '/mmkv/favourites'
});

const storageInit = () => {
    const storage = SettingsStorage.getAllKeys();

    if (storage.length === 0) {
        Object.keys(StorageDefaults).forEach((key) => {
            const value = StorageDefaults.value;

            if (Number.isInteger(value) || typeof value === 'boolean') {
                SettingsStorage.set(key, value)
            } else {
                SettingsStorage.set(key, JSON.stringify(StorageDefaults[key]));
            }
        })
    }
}

const addFavouritesListener = (callback) => {
    FavouritesStorage.addOnValueChangedListener(() => {
        callback(true);
    })
}

const addSettingsListener = (callback) => {
    SettingsStorage.addOnValueChangedListener((key) => {
        callback(key);
    })
}

export { SettingsStorage, FavouritesStorage, storageInit, addFavouritesListener, addSettingsListener };