import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    Dimensions,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./until/AppContext";
import * as ImagePicker from "expo-image-picker";
import { async } from "@firebase/util";
import color from "./images/color";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { app } from "../config";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

const Home = () => {
    const [picture, setPicture] = useState(null);
    const [image, setImage] = useState(null);
    const [upload, setUpload] = useState('');
    const [user, setUser] = useState({
        name: '',
        address: '',
        phone: '',
        birthday: '',
        email: '',
    })

    const storage = getStorage(app);
    const db = getFirestore(app);
    const auth = getAuth(app);
    useEffect(() => {
        console.log('id email:' + auth.currentUser.uid)
        const getData = async () => {
            const docSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
            if (docSnap.exists) {
                setUser({
                    name: docSnap.data().username,
                    phone: docSnap.data().phone,
                    birthday: docSnap.data().birthday,
                    address: docSnap.data().address,
                    email: auth.currentUser.email
                })
                setImage(docSnap.data().imageUri)
            }
        }
        getData();
        return () => {

        }
    }, [])


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
        const storageRef = ref(storage, "users/" + Date.now());
        const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                setUpload("Upload is " + progress + "% done")
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
        let result = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 4],
            quality: 1,
            allowsEditing: true,
        });

        if (!result.canceled) {
            setPicture(result.assets[0].uri);
        }
    };

    const updateProfile = async () => {
        if (!user.name || !image) {
            Alert.alert("Notification", "Update Failed !");
        } else {
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                username: user.name,
                phone: user.phone,
                imageUri: image,
                address: user.address,
                birthday: user.birthday,
            }).then(() => {
                Alert.alert("Notification", "Update Success !");
            });
        }
    };

    const handleOnChange = (text, input) => {
        setUser((prevState) => ({ ...prevState, [input]: text }));
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={{ marginTop: 40, color: color.green, fontSize: 24 }}>
                    PROFILE
                </Text>
                <TouchableOpacity onPress={pickImageLibary}>
                    {image ? (
                        <Image
                            source={{ uri: image }}
                            style={{ width: 120, height: 120, borderRadius: 100, marginTop: 20 }}
                        ></Image>
                    ) : (
                        <Image
                            source={require("./images/imagedefault.jpg")}
                            style={{ width: 120, height: 120, borderRadius: 100, marginTop: 20 }}
                        ></Image>
                    )}
                </TouchableOpacity>
                <Text style={{ marginTop: 8 }}>{user.email}</Text>
                <View style={styles.input}>
                    <TouchableOpacity style={{ marginRight: 20 }}>
                        <FontAwesome5
                            style={styles.searchIcon}
                            name="user-edit"
                            size={20}
                            color={color.green}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={{ width: Dimensions.get("window").width - 120 }}
                        placeholder="Name"
                        value={user.name}
                        onChangeText={(text) => handleOnChange(text, 'name')}
                    ></TextInput>
                </View>
                <View style={styles.input}>
                    <TouchableOpacity style={{ marginRight: 20 }}>
                        <Icon
                            style={styles.searchIcon}
                            name="location"
                            size={20}
                            color={color.green}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={{ width: Dimensions.get("window").width - 120 }}
                        placeholder="Address"
                        value={user.address}
                        onChangeText={(text) => handleOnChange(text, 'address')}
                    ></TextInput>
                </View>
                <View style={styles.input}>
                    <TouchableOpacity style={{ marginRight: 20 }}>
                        <Icon
                            style={styles.searchIcon}
                            name="md-call-sharp"
                            size={20}
                            color={color.green}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={{ width: Dimensions.get("window").width - 120 }}
                        placeholder="Phone"
                        value={user.phone}
                        onChangeText={(text) => handleOnChange(text, 'phone')}
                    ></TextInput>
                </View>
                <View style={styles.input}>
                    <TouchableOpacity style={{ marginRight: 20 }}>
                        <FontAwesome5
                            style={styles.searchIcon}
                            name="birthday-cake"
                            size={20}
                            color={color.green}
                        />
                    </TouchableOpacity>
                    <TextInput
                        style={{ width: Dimensions.get("window").width - 120 }}
                        placeholder="Birthday"
                        value={user.birthday}
                        onChangeText={(text) => handleOnChange(text, 'birthday')}
                    ></TextInput>
                </View>
                <TouchableOpacity style={styles.button} onPress={updateProfile}>
                    <Text style={{ color: color.white }}>UPDATE</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        marginStart: 30,
        marginEnd: 30,
    },
    image: {
        width: 120,
        height: 120,
        marginTop: 20,
        backgroundColor: "red",
        borderRadius: 100,
    },
    input: {
        borderWidth: 1,
        borderColor: color.green,
        marginTop: 8,
        padding: 8,
        width: "100%",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    button: {
        marginTop: 20,
        width: "100%",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: color.green,
    },
});
