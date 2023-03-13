import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import color from "./images/color";
import * as ImagePicker from "expo-image-picker";
import { async } from "@firebase/util";
import { app } from "../config";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { addDoc, collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Post = () => {
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [picture, setPicture] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorImage, setErrorImage] = useState(null);
  const [errorTitle, setErrorTille] = useState("");
  const [errorContent, setErrorContent] = useState("");
  const [focused, setFocused] = useState(false);
  const handleErrorTitle = (text) => {
    setErrorTille(text);
  };
  const handleErrorContent = (text) => {
    setErrorContent(text);
  };
  const handleErrorImage = (text) => {
    setErrorImage(text);
  };

  const storage = getStorage(app);

  const capture = async () => {
    handleErrorImage("");
    let result = await ImagePicker.launchCameraAsync({
      aspect: [4, 4],
      quality: 1,
      allowsEditing: true,
    });
    if (!result.canceled) {
      setPicture(result.assets[0].uri);
    }
  };

  const uploadImg = async () => {
    const blobImage = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", picture, true);
      xhr.send(null);
    });
    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: "image/jpeg",
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, "posts/" + Date.now());
    const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImage(downloadURL);
          console.log("File available at", downloadURL);
        });
      }
    );
  };

  if (picture != null) {
    uploadImg();
    setPicture(null);
  }
  const pickImageLibary = async () => {
    handleErrorImage("");
    let result = await ImagePicker.launchImageLibraryAsync({
      aspect: [4, 4],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setPicture(result.assets[0].uri);
    }
  };
  const Validate = () => {
    let val = true;
    if (!content) {
      handleErrorContent("* Enter your content");
      val = false;
    }
    if (!image) {
      handleErrorImage("* Enter your image");
      val = false;
    }
    if (!title) {
      handleErrorTitle("* Enter your title");
      val = false;
    }
    if (val) {
      submitNews();
    }
  };
  const db = getFirestore(app);
  const submitNews = async () => {
    const docRef = await addDoc(collection(db, "Posts"), {
      title: title,
      content: content,
      imageUri: image,
      userId: getAuth(app).currentUser.uid,
    }).then(() => {
      Alert.alert("Complete", "Post Success");
      clearAll();
    });
  };

  const clearAll = () => {
    setImage(null);
    setTitle("");
    setContent("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={clearAll}>
          <Text style={{ fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, color: color.green, fontWeight: "bold" }}>
          New Post
        </Text>
        <TouchableOpacity onPress={Validate}>
          <Text style={{ fontSize: 16 }}>Submit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleImage}>
        <Text style={styles.error}>{errorTitle}</Text>
        <TextInput
          style={styles.coverTitle}
          value={title}
          onChangeText={setTitle}
          onFocus={() => {
            handleErrorTitle();
            setFocused(true);
          }}
          placeholder="Title"
          placeholderTextColor={color.gray}
          multiline={false}
          numberOfLines={2}
        ></TextInput>
        <Text style={styles.error}>{errorImage}</Text>
        <View style={styles.coverimage}>
          <View style={styles.image}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={{ width: 120, height: 120, borderRadius: 8 }}
              ></Image>
            ) : (
              <Image
                source={require("./images/imagedefault.jpg")}
                style={{ width: 120, height: 120, borderRadius: 8 }}
              ></Image>
            )}
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-around",
              height: 120,
            }}
          >
            <TouchableOpacity style={styles.chooseimage} onPress={capture}>
              <Text style={{ color: color.white }}>Take photo </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chooseimage}
              onPress={pickImageLibary}
            >
              <Text style={{ color: color.white }}>Choose Image </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text style={styles.error}>{errorContent}</Text>
      <View style={styles.coverInput}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Enter your post"
          onFocus={() => {
            handleErrorContent();
            setFocused(true);
          }}
          placeholderTextColor={color.gray}
          multiline
          numberOfLines={2}
          style={styles.inputPost}
        ></TextInput>
      </View>
      <View style={{ flex: 0.5 }}></View>
    </View>
  );
};

export default Post;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginStart: 15,
    marginEnd: 15,
  },
  header: {
    flexDirection: "row",
    marginTop: 40,
    alignItems: "center",
    justifyContent: "space-between",
  },
  coverInput: {
    flex: 1,
    backgroundColor: color.whitesmoke,
    borderRadius: 8,
  },
  inputPost: {
    padding: 10,
  },
  titleImage: {
    marginTop: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  coverTitle: {
    backgroundColor: color.whitesmoke,
    borderRadius: 8,
    padding: 10,
  },
  coverimage: {
    flexDirection: "row",
    alignItems: "center",
  },
  chooseimage: {
    backgroundColor: color.green,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
    borderRadius: 5,
    marginLeft: 20,
  },
  error: {
    color: color.red,
  },
});
