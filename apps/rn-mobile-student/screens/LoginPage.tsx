import { View, TouchableOpacity, Text, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useLayoutEffect, useState, useContext } from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import jwtDecode from 'jwt-decode'
import { Input } from '@rneui/base';
import { AuthContext } from '../library/AuthContext';
import { UserJWTDecoded } from 'types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosAuth } from '../library/axios';

type Props = NativeStackScreenProps<RootStackParamList, 'LoginPage'>;

const LoginPage = ({ route, navigation }: Props) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setAuth } = useContext(AuthContext);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation])

  const handleSubmit = async () => {
    if (username == '' || password === '') return
    try {

      const res = await axiosAuth.post('login/student', {
          username,
          password
      })
      if(res.status !== 200) return
      const data = await res.data
      console.log(data)
      const user: UserJWTDecoded = jwtDecode(data.accessToken)
      await AsyncStorage.setItem('auth', data.refreshToken)
      setAuth({
        user,
        accessToken: data.accessToken,
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 2, backgroundColor: '#5465FF' }}>
            <Image
              source={{ uri: 'https://media.istockphoto.com/photos/happy-high-school-students-raising-their-hands-on-a-class-picture-id1157905264?k=20&m=1157905264&s=170667a&w=0&h=aqIdC5EMl8LgV8vl_6D1P6CIpAsoRFGpL5jktlgIvkk=' }}
              style={{ width: '100%', height: '100%' }}
            />
          </View>
          <View style={{ flex: 3, padding: 25 }}>
            <Text style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 20 }}>Welcome</Text>
            <Input keyboardType='email-address' value={username} onChangeText={(t) => setUsername(t)} placeholder='Username' />
            <Input value={password} secureTextEntry onChangeText={(t) => setPassword(t)} placeholder='Password' />
            <TouchableOpacity onPress={handleSubmit} style={{ backgroundColor: '#5465FF', padding: 10, borderRadius: 14 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: 'white', textAlign: 'center' }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default LoginPage