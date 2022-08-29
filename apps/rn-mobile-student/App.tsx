import { StatusBar } from 'expo-status-bar';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from './library/AuthContext';
import LoginPage from './screens/LoginPage';
import StartPage from './screens/StartPage';
import MainAppPage from './screens/MainAppPage';
import useNativeAuthentication from './hooks/useNativeAuthentication';
import { ColorModeContext } from './library/AppearanceContext';
import { DarkColors, LightColors } from 'ui'
import StudentAssignmentView from './screens/app-tabs-screens/subscreens/StudentAssignmentView';
import LoadingPage from './screens/LoadingPage';

export type RootStackParamList = {
  Home: undefined;
  StartPage: undefined;
  LoginPage: undefined;
  LoadingPage: undefined;
  StudentAssignmentView: { ASSIGNMENT_ID: string | number };
}

const Stack = createNativeStackNavigator<RootStackParamList>();
export default function App() {
  const { auth, setAuth, loading, isLoggedIn, logout } = useNativeAuthentication();
  const colorScheme = useColorScheme();
  console.log({ loading, auth})
  return (
    <ColorModeContext.Provider
      value={colorScheme === 'dark' ? DarkColors : LightColors}
    >
      <AuthContext.Provider value={{
        isLoggedIn,
        setAuth,
        auth,
        loading,
        logout
      }}>
        <View style={{ flex: 1, backgroundColor: '#2F3136' }}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{
              headerShown: false, contentStyle: {
                backgroundColor: colorScheme === 'dark' ? '#2F3136' : '#fff'
              }
            }}>
              {!loading ? (
                <>
                  {
                    isLoggedIn ? (
                      <>
                        <Stack.Screen name="Home" component={MainAppPage} />
                        <Stack.Screen name="StudentAssignmentView" component={StudentAssignmentView} />
                      </>
                    ) : (
                      <>
                        <Stack.Screen name="StartPage" component={StartPage} />
                        <Stack.Screen name="LoginPage" component={LoginPage} />
                      </>
                    )}
                </>
              ) : (
                <Stack.Screen name="LoadingPage" component={LoadingPage} />
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </View>
        <StatusBar style="auto" />
      </AuthContext.Provider >
    </ColorModeContext.Provider >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
