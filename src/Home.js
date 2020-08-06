import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Home({navigation}) {
    return (
        <View style={styles.container}>
            <Text>Voce logou!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    element: {
        marginBottom: 16
    }
});
