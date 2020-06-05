import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Feather as Icon } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import MapView from 'react-native-maps';

import {} from '';

import styles from './styles';

const Points = () => {

    const navigation = useNavigation();

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" color="#34CB79" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Bem vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
                <View style={styles.mapContainer}>
                    <MapView style={styles.map} />
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <TouchableOpacity style={styles.item} onPress={() => { }}>
                    {/* <Image source={} /> */}
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Points;