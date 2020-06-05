import React from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';

import { Feather as Icon, FontAwesome } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native';

import { RectButton } from 'react-native-gesture-handler';

import styles from './styles';

const Details = () => {

    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" color="#34CB79" size={24} />
                </TouchableOpacity>
                <Image style={styles.pointImage} source={{ uri: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80" }} />
                <Text style={styles.pointName}>Mercado</Text>
                <Text style={styles.pointItems}>Nome Item</Text>
                <View style={styles.address}>
                    <Text style={styles.addressTitle}>Title</Text>
                    <Text style={styles.addressContent}>Cidade</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <RectButton style={styles.button}>
                    <FontAwesome name="whatsapp" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>Whatsapp</Text>
                </RectButton>
                <RectButton style={styles.button}>
                    <Icon name="mail" size={20} color="#FFF" />
                    <Text style={styles.buttonText}>E-mail</Text>
                </RectButton>
            </View>
        </SafeAreaView>
    )
}

export default Details;