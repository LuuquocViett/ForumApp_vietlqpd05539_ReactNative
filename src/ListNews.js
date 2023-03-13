import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ItemListNews from "./ItemListNews";
import Icon from "react-native-vector-icons/Ionicons";
import color from "./images/color";
import { ActivityIndicator } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../config";
import { AppContext } from "./until/AppContext";
import { collection, getFirestore, onSnapshot } from "firebase/firestore";

const ListNews = (props) => {
  const { navigation } = props;
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [searchText, setsearchText] = useState("");
  const { setIsLogin } = useContext(AppContext);

  const db = getFirestore(app);
  useEffect(() => {
    const getNews = async () => {
      setLoading(false);
      const ref = collection(db, "Posts");
      onSnapshot(ref, (posts) =>
        setData(
          posts.docs.map((post) => ({
            id: post.id,
            data: post.data(),
          }))
        )
      );
    };
    getNews();
    return () => { };
  }, []);

  let timeOut = null;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <View style={styles.searchSection}>
          <TouchableOpacity>
            <Icon
              style={styles.searchIcon}
              name="search"
              size={20}
              color={color.green}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="search"
            underlineColorAndroid="transparent"
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            const auth = getAuth(app);
            signOut(auth)
              .then(() => {
                setIsLogin(false);
              })
              .catch((error) => {
                console.log(error.code);
              });
          }}
        >
          <Text style={styles.text}>Log out</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size={"large"} color={color.green} />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ItemListNews dulieu={item} navigation={navigation} />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ListNews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginStart: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginEnd: 10,
    marginBottom: 8,
  },
  text: {
    color: color.green,
  },
  searchSection: {
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: color.green,
    borderRadius: 8,
    height: 40,
    flex: 0.8,
  },
  searchIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
  },
});
