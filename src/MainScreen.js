import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NewsDetail from './NewsDetail';
import ListNews from './ListNews';
import Icon from 'react-native-vector-icons/Ionicons';
import color from './images/color';
import Home from './Home';
import Post from './Post';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
// const Tab = createMaterialBottomTabNavigator();
const News = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name='ListNews' component={ListNews} />
            <Stack.Screen name='NewsDetail' component={NewsDetail} />
        </Stack.Navigator>
    )
}

const MainScreen = () => {
    return (
        <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarStyle: {
            backgroundColor: color.green,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,}}}>
            <Tab.Screen name="Home" component={Home} 
                options = {{
                    tabBarIcon : ({focused}) => (
                        <View style={{alignItems: 'center'}}>
                            <Icon name={focused ? 'home' : 'home-outline'} 
                                    size={focused ? 25 : 18} 
                                    color={focused ? color.white : color.gray}/>
                            <Text style={{color: focused ? color.white  : color.gray, fontSize: 12}}>Home</Text>
                        </View>
                    )
                }}
            />
            <Tab.Screen name="News" component={News} 
            options = {{
                tabBarIcon : ({focused}) => (
                    <View style={{alignItems: 'center'}}>
                        <Icon name={focused ? 'newspaper' : 'newspaper-outline'} 
                                size={focused ? 25 : 18} 
                                color={focused ? color.white  : color.gray}/>
                        <Text style={{color: focused ? color.white  : color.gray, fontSize: 12}}>News</Text>
                    </View>
                )
            }}
            />
            <Tab.Screen name="Post" component={Post} 
            options = {{
                tabBarIcon : ({focused}) => (
                    <View style={{alignItems: 'center'}}>
                        <Icon name={focused ? 'ios-duplicate-sharp' : 'ios-duplicate-outline'} 
                                size={focused ? 25 : 18} 
                                color={focused ? color.white  : color.gray}/>
                        <Text style={{color: focused ? color.white  : color.gray, fontSize: 12}}>Post</Text>
                    </View>
                )
            }}
            />
        </Tab.Navigator>
    )
}

export default MainScreen

const styles = StyleSheet.create({})
