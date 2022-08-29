import { createBottomTabNavigator, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications'
import { useContext, useLayoutEffect } from 'react'
import UpdatePage from '../app-tabs-screens/UpdatePage';
import AssignmentsPage from '../app-tabs-screens/AssignmentsPage';
import MessagesPage from '../app-tabs-screens/MessagesPage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DrawerActions } from '@react-navigation/native';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native'
import { DrawerStackParamList } from '../MainAppPage';
import { Avatar, Icon } from '@rneui/base';
import { ColorModeContext } from '../../library/AppearanceContext';
import { AuthContext } from '../../library/AuthContext';

export type TabStackParamList = {
    UpdatePage: undefined;
    Assignments: undefined;
    Messages: undefined;
    AssignmentViewPage: undefined;
}

type Props = NativeStackScreenProps<DrawerStackParamList, 'HomeDrawer'>;

const HomeTabsBottom = createBottomTabNavigator<TabStackParamList>();


const HomePage = ({ navigation }: Props) => {
    const { auth } = useContext(AuthContext)
    const color = useContext(ColorModeContext)
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation])


    const headerOptions: BottomTabNavigationOptions = {
        headerRight: () => (
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} style={{ display: 'flex', flexDirection: 'row', marginRight: 15, marginBottom: 5 }}>
                <Avatar source={{ uri: auth?.user.PHOTO_URL }} size={40} rounded renderPlaceholderContent={<ActivityIndicator />} />
            </TouchableOpacity>
        ),
        tabBarActiveTintColor: color.primary,
        tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: 'bold',
        },
        tabBarInactiveTintColor: color.textPrimary,
        tabBarStyle: {
            backgroundColor: color.lightDark,
            borderTopWidth: 0,
            elevation: 0,
            shadowColor: 'transparent',
            shadowOpacity: 0,
            paddingTop: 5
        },
        headerStyle: {
            backgroundColor: color.lightDark,
            borderWidth: 0,
            elevation: 0,
            shadowColor: 'transparent',
        },
        headerTitleStyle: {
            fontSize: 15,
            fontWeight: 'bold',
            color: color.textPrimary,
            textAlign: 'left',
        },

    }

    return (
        <View
            style={{ backgroundColor: color.light, flex: 1 }}
        >
            <HomeTabsBottom.Navigator sceneContainerStyle={{ backgroundColor: color.light }} initialRouteName='UpdatePage' screenOptions={headerOptions} >
                <HomeTabsBottom.Screen name="UpdatePage" component={UpdatePage} options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="home" size={25} color={color} />
                    )
                }} />
                <HomeTabsBottom.Screen name="Assignments" component={AssignmentsPage} options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="assignment" size={25} color={color} />
                    )
                }} />
                <HomeTabsBottom.Screen name="Messages" component={MessagesPage} options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="message" size={25} color={color} />
                    )
                }} />
            </HomeTabsBottom.Navigator>
        </View>
    )
}

export default HomePage