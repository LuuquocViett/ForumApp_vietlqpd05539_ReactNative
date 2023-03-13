import { View, Text } from "react-native";
import React, { useContext } from "react";
import Login from "../Login";
import Register from "../Register";
import color from "../images/color";
import Icon from "react-native-vector-icons/Ionicons";
import ListNews from "../ListNews";
import Post from "../Post";
import Home from "../Home";
import NewsDetail from "../NewsDetail";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppContext } from "./AppContext";
import MainScreen from "../MainScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const News = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ListNews" component={ListNews} />
            <Stack.Screen name="NewsDetail" component={NewsDetail} />
        </Stack.Navigator>
    );
};

const Users = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Login" component={Login} />
            {/* <Stack.Screen name='Main' component={MainScreen}/> */}
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
    );
};

const Main = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: color.green,
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                },
            }}
        >
            <Tab.Screen
                name="News"
                component={News}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: "center" }}>
                            <Icon
                                name={focused ? "newspaper" : "newspaper-outline"}
                                size={focused ? 25 : 18}
                                color={focused ? color.white : color.gray}
                            />
                            <Text
                                style={{
                                    color: focused ? color.white : color.gray,
                                    fontSize: 12,
                                }}
                            >
                                News
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Post"
                component={Post}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: "center" }}>
                            <Icon
                                name={focused ? "ios-duplicate-sharp" : "ios-duplicate-outline"}
                                size={focused ? 25 : 18}
                                color={focused ? color.white : color.gray}
                            />
                            <Text
                                style={{
                                    color: focused ? color.white : color.gray,
                                    fontSize: 12,
                                }}
                            >
                                Post
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{ alignItems: "center" }}>
                            <Icon
                                name={focused ? "person" : "person-outline"}
                                size={focused ? 25 : 18}
                                color={focused ? color.white : color.gray}
                            />
                            <Text
                                style={{
                                    color: focused ? color.white : color.gray,
                                    fontSize: 12,
                                }}
                            >
                                Profile
                            </Text>
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const { isLogin } = useContext(AppContext);
    return <>{isLogin == false ? <Users /> : <Main />}</>;
};

export default AppNavigator;
