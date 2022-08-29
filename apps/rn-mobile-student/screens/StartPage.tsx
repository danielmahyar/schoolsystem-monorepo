import { View, Image, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { useContext, useLayoutEffect } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ColorModeContext } from '../library/AppearanceContext';

type Props = NativeStackScreenProps<RootStackParamList, 'StartPage'>;

const StartPage = ({ route, navigation }: Props) => {
    const color = useContext(ColorModeContext);
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={require('../assets/logo_only.png')}
                    style={{ height: '100%', aspectRatio: 1 }}
                />
            </View>
            <View style={{ flex: 2, padding: 20, display: 'flex', flexShrink: 0 }}>
                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 10 }}>
                    <View style={{ width: 10, height: 10, backgroundColor: 'blue', borderRadius: 9999, marginRight: 4 }}></View>
                    <View style={{ width: 10, height: 10, backgroundColor: 'gray', borderRadius: 9999, marginRight: 4 }}></View>
                    <View style={{ width: 10, height: 10, backgroundColor: 'gray', borderRadius: 9999 }}></View>
                </View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: color.textPrimary }}>Dette er en test</Text>
                <Text style={{ fontSize: 16, fontWeight: '400', marginBottom: 30, color: '#71727A' }}>Join your local school to view your assignments and contact teachers</Text>
                <TouchableOpacity onPress={() => navigation.replace('LoginPage')} style={{ backgroundColor: "#5465FF", width: '100%', alignSelf: 'center', padding: 14, borderRadius: 14 }}>
                    <Text style={{ color: "white", fontSize: 14, fontWeight: '600', textAlign: 'center' }}>Continue to Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default StartPage