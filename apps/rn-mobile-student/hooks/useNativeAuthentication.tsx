import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { AuthState, UserJWTDecoded } from 'types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axiosAuth } from '../library/axios';
export default function useNativeAuthentication() {
    const [auth, setAuth] = useState<AuthState | null>(null);
    const [loading, setLoading] = useState(true);
    const isLoggedIn = auth !== null;

    useEffect(() => {
        async function getAuth() {
            const refreshToken = await AsyncStorage.getItem('auth');
            console.log(refreshToken)
            if (refreshToken !== null) {
                try {
                    console.log(refreshToken)

                    const res = await axiosAuth.post('/refresh', {
                        refreshToken
                    })

                    const data = await res.data;
                    const user: UserJWTDecoded = jwtDecode(data.accessToken);
                    setAuth({
                        user,
                        accessToken: data.accessToken,
                    });
                } catch (error) {
                    console.log(error);
                }
                setLoading(false)
            } else {
                setAuth(null);
                setLoading(false)
            }
        }
        if (!auth) {
            getAuth()
        }
    }, [auth]);

    const logout = async () => {
        await AsyncStorage.removeItem('auth');
        setAuth(null);
    }
    return { auth, setAuth, loading, isLoggedIn, logout };
}