import { View, Text, FlatList, Image, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import { ColorModeContext } from '../../library/AppearanceContext';

const UpdatePage = () => {
    const color = useContext(ColorModeContext)
    const randomArray = Array.from({ length: 10 }, () => Math.floor(Math.random()));
    return (
        <ScrollView style={{ flex: 1, padding: 15 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 20, color: color.textPrimary }}>Welcome Back!</Text>
            <View style={{ height: 200 }}>
                <FlatList
                    horizontal
                    data={randomArray}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <Image source={require('../../assets/pb.jpg')} style={{ height: '100%', aspectRatio: 16 / 9 }} />}
                />
            </View>
        </ScrollView>
    )
}

export default UpdatePage