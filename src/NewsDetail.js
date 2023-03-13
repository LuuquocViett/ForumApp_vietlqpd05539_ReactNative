import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import React, { useEffect, useState } from "react";

import color from "./images/color";
import { doc, getDoc, getFirestore, deleteDoc } from "firebase/firestore";
import { app } from "../config";
import { getAuth } from "firebase/auth";

const NewsDetail = (props) => {
  const { route, navigation } = props;
  const { params } = route;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userId, setuserId] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const db = getFirestore(app);

  const docRef = doc(db, "Posts", params.id);
  useEffect(() => {
    const getDetail = async () => {

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTitle(docSnap.data().title);
        setContent(docSnap.data().content);
        setImageUrl(docSnap.data().imageUri);
        setuserId(docSnap.data().userId);
        setisLoading(false);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    getDetail();
    console.log('Name: ' + params.name)
    return () => { };
  }, []);

  const deletePost = async () => {
    if (userId === getAuth(app).currentUser.uid) {
      await deleteDoc(doc(db, "Posts", params.id));
      navigation.navigate('ListNews')
      alert('Delete success')
    } else {
      alert('Only the author has the right to delete the post')
    }
  }

  return (
    <>
      {isLoading == true ? (
        <View style={styles.loading}>
          <ActivityIndicator size={"large"} color={color.green} />
          <Text style={{ marginLeft: 10 }}>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.view}>
            <Text style={{ color: color.red, fontStyle: 'italic' }}>{params.name}</Text>
            <TouchableOpacity onPress={deletePost}>
              <Text style={{ color: color.green }}>Delete</Text>
            </TouchableOpacity>
          </View>

          <Image style={styles.image} source={{ uri: imageUrl }}></Image>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
        </ScrollView>
      )}
    </>
  );
};

export default NewsDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginStart: 10,
    marginEnd: 10,
  },
  view: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "stretch",
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    marginTop: 10,
  },
  date: {
    marginTop: 5,
    fontStyle: "italic",
    color: color.red,
  },
  loading: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
