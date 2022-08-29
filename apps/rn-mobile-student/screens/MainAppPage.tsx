import React, { useContext } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { AuthContext } from '../library/AuthContext';
import { createDrawerNavigator, DrawerNavigationOptions } from '@react-navigation/drawer';
import HomePage from './app-drawer-screens/HomePage';
import SettingsPage from './app-drawer-screens/SettingsPage';
import ProfilePage from './app-drawer-screens/ProfilePage';
import DrawerNavigationStyling from '../components/DrawerNavigationStyling';
import { Icon } from '@rneui/base';
import { ColorModeContext } from '../library/AppearanceContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;


export type DrawerStackParamList = {
  HomeDrawer: undefined;
  Settings: undefined;
  Profile: undefined;
}


const DrawerTop = createDrawerNavigator<DrawerStackParamList>();

const MainAppPage = () => {
  const color = useContext(ColorModeContext)
  const { auth } = React.useContext(AuthContext)
  const globalOptions: DrawerNavigationOptions = {
    drawerLabelStyle: {
      marginLeft: -25,
      fontSize: 15,
    },
    drawerActiveBackgroundColor: color.primary,
    drawerActiveTintColor: 'white',
    drawerInactiveTintColor: color.textPrimary,
    sceneContainerStyle: {
      backgroundColor: color.background,
    }
  }

return (
  <DrawerTop.Navigator
    useLegacyImplementation
    initialRouteName='HomeDrawer'
    drawerContent={props => <DrawerNavigationStyling {...props} />}
    screenOptions={globalOptions}
  >
    <DrawerTop.Screen name="HomeDrawer" component={HomePage} options={{
      drawerIcon: ({ color }) => (
        <Icon size={28} name="home" color={color} />
      ),
      drawerLabel: "Main Page"
    }} />
    <DrawerTop.Screen name="Profile" component={ProfilePage} options={{
      drawerIcon: ({ color }) => (
        <Icon size={28} name="account-circle" color={color} />
      ),
      drawerLabel: "View Profile"
    }} />
    <DrawerTop.Screen name="Settings" component={SettingsPage} options={{
      drawerIcon: ({ color }) => (
        <Icon size={28} name="settings" color={color} />
      ),
      drawerLabel: "Settings",
    }} />
  </DrawerTop.Navigator>
)
}

export default MainAppPage