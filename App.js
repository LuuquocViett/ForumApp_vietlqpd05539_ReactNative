import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppContext, AppContextProvider } from './src/until/AppContext';
import AppNavigator from './src/until/AppNavigator';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <AppContextProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style='auto' />
      </NavigationContainer>
    </AppContextProvider>
  )

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
