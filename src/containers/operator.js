import { FlatList, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { isDarkTheme } from '../contexts/theme';
import BundledData from '../storage/data.json';

const Link = ({name, icon, background, url}) => (
    <View style={styles.linkContainer}>
        <Pressable
            style={[
                styles.link,
                {backgroundColor: background}
            ]}
            onPress={() => Linking.openURL(url)}
        >
            <Icon
                name={icon}
                color={'#ddd'}
                size={18}
                style={styles.operatorIcon}
            />
            <Text style={styles.linkText}>{name}</Text>
        </Pressable>
    </View>
)

const Operator = ({name, details, tag, colour, url, twitter, facebook}) => (
    <View style={[
        styles.operatorContainer,
        darkTheme && darkStyles.operatorContainer
    ]}>
        <View style={styles.operatorHeader}>
            <Text style={[
                styles.operatorTitle,
                darkTheme ? darkStyles.text : styles.text
            ]}>{name}</Text>
            <Text style={[
                styles.operatorTag,
                {backgroundColor: (colour ?? '#777')}
            ]}>{tag}</Text>
        </View>
        <Text style={[
            styles.details,
            darkTheme ? darkStyles.text : styles.text
        ]}>{details}</Text>
        <View style={styles.linksContainer}>
            {url &&
                <Link
                    name="Website"
                    icon="globe-outline"
                    background={darkTheme ? '#9d5baf' : '#3c1053'}
                    url={url}
                />
            }
            {twitter &&
                <Link
                    name="Twitter"
                    icon="logo-twitter"
                    background={'#1d9bf0'}
                    url={'https://twitter.com/' + twitter}
                />
            }
            {facebook &&
                <Link
                    name="Facebook"
                    icon="logo-facebook"
                    background={'#1877f2'}
                    url={'https://facebook.com/' + facebook}
                />
            }
        </View>
    </View>
)

function OperatorContainer() {
    const operators = BundledData.operators;
    darkTheme = isDarkTheme();

    return (
        <View>
            <FlatList
                data={Object.keys(operators)}
                renderItem={({item}) => (
                    <Operator {...operators[item]} />
                )}
                keyExtractor={item => item}
                ListHeaderComponent={<Text style={[
                    styles.header,
                    darkTheme ? darkStyles.text : styles.text
                ]}>Operators In The West Midlands</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        marginHorizontal: 15,
        marginVertical: 20,
        fontSize: 22,
        fontWeight: 'bold'
    },
    text: {
        color: '#333'
    },
    operatorContainer: {
        backgroundColor: 'white',
        gap: 15,
        padding: 10,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10
    },
    operatorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        borderRadius: 5,
        padding: 5,
    },
    operatorTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    operatorTag: {
        color: '#ddd',
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 5,
        borderRadius: 5,
        textAlign: 'center',
        textShadowColor:'#000',
        textShadowRadius: 10,
        width: 60
    },
    details: {
        marginHorizontal: 5
    },
    linksContainer: {
       flexDirection: 'row'
    },
    linkContainer: {
        width: '33.3%'
    },
    link: {
        margin: 4,
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 5,
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'center'
    },
    linkText: {
        color: '#ddd',
        fontWeight: 'bold'
    }
});

const darkStyles = StyleSheet.create({
    operatorContainer: {
        backgroundColor: '#444'
    },
    text: {
        color: '#ccc'
    }
});

export default OperatorContainer;