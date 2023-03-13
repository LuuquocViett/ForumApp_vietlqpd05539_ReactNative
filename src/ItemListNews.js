import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import color from "./images/color";
import { app } from "../config";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { addDoc, collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ItemListNews = (props) => {
  const { dulieu, navigation } = props;
  const db = getFirestore(app);
  const [name, setName] = useState('');


  const getData = async () => {
    const docSnap = await getDoc(doc(db, 'users', dulieu.data.userId));
    if (docSnap.exists) {
      setName(docSnap.data().username);
    }
  }
  getData()
  const ClickItem = () => {
    navigation.navigate("NewsDetail", { id: dulieu.id, name: name });
  };
  return (
    <TouchableOpacity onPress={ClickItem}>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={{ uri: dulieu.data.imageUri }}
        ></Image>
        <View style={styles.content}>
          <Text style={styles.title}>{dulieu.data.title}</Text>
          <Text numberOfLines={2}>{dulieu.data.content}</Text>
          <Text style={{ color: color.red, fontStyle: 'italic' }}>- {name} -</Text>
        </View>
      </View>
    </TouchableOpacity >
  );
};

export default ItemListNews;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 10,
  },
  image: {
    height: 86,
    width: 86,
    borderRadius: 10,
    backgroundColor: color.gray,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    marginStart: 10,
    width: Dimensions.get("window").width - 86 - 30,
  },
});
