import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';

import { Feather as Icon } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import MapView, { Marker } from 'react-native-maps';

import { SvgUri } from 'react-native-svg';

import api from '../../services/api';

import styles from './styles';

interface Item {
    id: number;
    title: string;
    image_url: string;
}

const Points = () => {

    const navigation = useNavigation();

    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [items, setItems] = useState<Item[]>([]);

    useEffect(() => {
        getItems();
    }, []);

    const getItems = async () => {

        try {

            const response = await api.get("/items");

            setItems(response.data);

        } catch (error) {

        }

    }

    const handleSelectItem = (id: number) => {

        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {

            const filteredItems = selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);

        } else {
            setSelectedItems([...selectedItems, id])
        }

    }

    const handleNavigateDetails = () => navigation.navigate('Details');

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" color="#34CB79" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Bem vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>
                <View style={styles.mapContainer}>
                    <MapView
                        initialRegion={{
                            latitude: -23.7700463,
                            longitude: -52.4359009,
                            latitudeDelta: 0.014,
                            longitudeDelta: 0.014
                        }}
                        style={styles.map} >
                        <Marker
                            style={styles.mapMarker}
                            onPress={() => handleNavigateDetails()}
                            coordinate={{
                                latitude: -23.7700463,
                                longitude: -52.4359009,
                            }}>
                            <View style={styles.mapMarkerContainer}>
                                <Image style={styles.mapMarkerImage} source={{ uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80" }} />
                                <Text style={styles.mapMarkerTitle}>Mercado</Text>
                            </View>
                        </Marker>
                    </MapView>
                </View>
            </View>
            <View style={styles.itemsContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 20
                    }}
                >
                    {items.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.item,
                                selectedItems.includes(item.id) ? styles.selectedItem : {}
                            ]}
                            activeOpacity={0.6}
                            onPress={() => handleSelectItem(item.id)}>
                            <SvgUri
                                width={42}
                                height={42}
                                uri={item.image_url}
                            />
                            <Text style={styles.itemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Points;