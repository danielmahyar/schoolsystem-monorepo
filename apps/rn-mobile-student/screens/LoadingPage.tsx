import { View, ActivityIndicator } from 'react-native'
import { Text } from '@rneui/base'
import React from 'react'

const LoadingPage = () => {
  return (
    <View>
        <ActivityIndicator />
        <Text h1 style={{ color: 'white'}}>LOADING</Text>
    </View>
  )
}

export default LoadingPage