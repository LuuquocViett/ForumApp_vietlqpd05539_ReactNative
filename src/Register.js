import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ToastAndroid, Alert } from 'react-native'
import React, { useState } from 'react'
import color from './images/color';
import { app } from '../config'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, setDoc, doc } from "firebase/firestore";

const Register = (props) => {

    const { navigation } = props;
    const clickSucess = () => {
        navigation.navigate('Login');
    }

    const [emailUser, setEmailUser] = useState('');
    const [passlUser, setPassUser] = useState('');
    const [nameUser, setNameUser] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPass, setErrorPass] = useState('');
    const [focused, setFocused] = useState(false);
    const handleErrorEmail = (text) => {
        setErrorEmail(text)
    }
    const handleErrorPass = (text) => {
        setErrorPass(text)
    }

    // const addUserFirestore = async (name, email, password, id) => {
    //     try {
    //         const docRef = await addDoc(collection(db, "users", id), {
    //             name: {name},
    //             email: {email},
    //             password: {password},
    //         });
    //         console.log("Document written with ID: ", docRef.id);
    //     } catch (e) {
    //         console.error("Error adding document: ", e);
    //     }
    // }

    const registerUser = async () => {
        const auth = getAuth(app);
        const db = getFirestore(app);
        createUserWithEmailAndPassword(auth, emailUser, passlUser)
            .then(async (userCredential) => {
                //create User
                return await setDoc(doc(db, "users", userCredential.user.uid), {
                    username: nameUser,
                    phone: '',
                    address: '',
                    birthday: '',
                    imageUri: ''
                });
                // Signed in 
            }).then(() => {
                Alert.alert('Notification', 'Sign Up Success !');
                navigation.navigate('Login');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + 'error')
                if (error.code == 'auth/invalid-email') {
                    handleErrorEmail("Invalid email *");
                }
                if (error.code == 'auth/weak-password' || error.code == 'auth/internal-error') {
                    handleErrorPass("Must be at least 6 characters *");
                }
            });
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { color: color.green }, { marginBottom: 20 }, { marginTop: 48 }]}>Register</Text>

            <View style={styles.card}>

                <Text>Username <Text style={{ color: 'red' }}>*</Text></Text>
                <TextInput style={styles.textinput} onChangeText={setNameUser} />
                <Text style={{ marginTop: 10 }}>Email <Text style={{ color: 'red' }}>*{errorEmail}</Text></Text>
                <TextInput style={styles.textinput} onChangeText={setEmailUser} onFocus={() => { handleErrorEmail(); setFocused(true); }} />
                <Text style={{ marginTop: 10 }}>Password <Text style={{ color: 'red' }}>*{errorPass}</Text></Text>
                <TextInput style={styles.textinput} secureTextEntry={true} onChangeText={setPassUser} onFocus={() => { handleErrorPass(); setFocused(true); }} />

                <TouchableOpacity style={styles.buttonRegister} onPress={registerUser}>
                    <Text style={styles.textRegister}>Sign Up</Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginStart: 15,
        marginEnd: 15,
        flexDirection: 'column',
    },
    text: {
        color: '#050505',
        fontSize: 48,
        fontWeight: 'bold',
    },
    card: {
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: color.white,
        padding: 20,
    },
    textinput: {
        height: 48,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: color.green,
        marginTop: 4,
        padding: 15,
    },
    rememberCover: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    remember: {
        flexDirection: 'row',
    },
    buttonRegister: {
        backgroundColor: color.red,
        height: 48,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textRegister: {
        color: color.white,
        fontWeight: 'bold',
        fontSize: 20,
    },
    continue: {
        marginTop: 20,
        alignItems: 'center',
    },
    imageSocial: {
        width: 21,
        height: 21,
        marginEnd: 10
    },
    buttonSocial: {
        flexDirection: 'row',
        width: 150,
        height: 48,
        marginTop: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    buttonSocialCover: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});
