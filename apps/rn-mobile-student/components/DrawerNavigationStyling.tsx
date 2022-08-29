import { View, Text, Image, TouchableOpacity } from 'react-native'
import {
    DrawerContentScrollView,
    DrawerItemList
} from '@react-navigation/drawer';
import React, { useContext } from 'react'
import { AuthContext } from '../library/AuthContext';
import { Icon } from '@rneui/base';
import { ColorModeContext } from '../library/AppearanceContext';

const DrawerNavigationStyling = (props: any) => {
    const { auth, logout } = useContext(AuthContext);
    const color = useContext(ColorModeContext)
    return (
        <View style={{ flex: 1, backgroundColor: color.lightDark }}>
            <DrawerContentScrollView
                contentContainerStyle={{ backgroundColor: color.primary }}
                scrollEnabled={false}
                {...props}
            >
                <View style={{ display: 'flex', flex: 1, alignItems: 'flex-start', justifyContent: 'center', paddingVertical: 20, paddingHorizontal: 20 }}>
                    <Image source={require('../assets/pb.jpg')} style={{ width: 120, height: 120, aspectRatio: 1, marginBottom: 10, borderRadius: 9999 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 20, fontWeight: '600', color: 'white', marginRight: 5 }}>{auth?.user.USERNAME}</Text>
                        <Icon name="lock" size={20} color="#fff" />
                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: color.lightDark, paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{ marginBottom: 30, marginHorizontal: 20, borderTopWidth: 1, borderTopColor: color.textPrimary }}>
                <TouchableOpacity
                    onPress={logout}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 20, borderRadius: 14, width: 200 }}
                >
                    <Icon name="logout" color={color.textPrimary} style={{ marginRight: 5 }} />
                    <Text style={{ color: color.textPrimary, fontWeight: 'bold' }}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default DrawerNavigationStyling