import { StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import color from './images/color';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { app } from '../config'
import { AppContext } from './until/AppContext';

const Login = (props) => {
    const auth = getAuth(app);

    const { setIsLogin } = useContext(AppContext);
    const [emailUser, setEmailUser] = useState('');
    const [passlUser, setPassUser] = useState('');
    const [toggleCheckBox, setToggleCheckBox] = useState(false);
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPass, setErrorPass] = useState('');
    const [focused, setFocused] = useState(false);
    const handleErrorEmail = (text) => {
        setErrorEmail(text)
    }
    const handleErrorPass = (text) => {
        setErrorPass(text)
    }
    const Validate = () => {
        let val = true;
        if (!emailUser) {
            handleErrorEmail('Please enter your email');
            val = false;
        } else if (!emailUser.match(/\S+@\S+\.\S+/)) {
            handleErrorEmail('Email invalidate');
            val = false;
        }
        if (!passlUser) {
            handleErrorPass('Please enter your password');
            val = false;
        }
        if (val) {
            clickLogin();
        }
    }

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLogin(true);
            } else {
            }
        });
        return unsub;
    }, [])

    const { navigation } = props;

    const clickLogin = async () => {
        signInWithEmailAndPassword(auth, emailUser, passlUser)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                setIsLogin(true);
            })
            .catch((error) => {
                console.log(error.code)
                if (error.code == 'auth/invalid-email') {
                    handleErrorEmail("Invalid email *");
                }
                if (error.code == 'auth/internal-error') {
                    handleErrorPass("Wrong password, try again *");
                }
                if (error.code == 'auth/user-not-found') {
                    handleErrorEmail("Couldn't find your email *");
                }
                if (error.code == 'auth/wrong-password') {
                    handleErrorPass("Wrong password, try again *");
                }
            });

    }

    const clickRegister = () => {
        navigation.navigate('Register')
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { marginTop: 48 }]}>Viet's</Text>
            <Text style={[styles.text, { color: color.green }, { marginBottom: 20 }]}>Forum</Text>

            <View style={styles.card}>
                <Text>Email <Text style={{ color: 'red' }}>*{errorEmail}</Text></Text>
                <TextInput style={styles.textinput} onChangeText={setEmailUser} onFocus={() => { handleErrorEmail(); setFocused(true); }} />
                <Text style={{ marginTop: 10 }}>Password <Text style={{ color: 'red' }}>*{errorPass}</Text></Text>
                <TextInput style={styles.textinput} secureTextEntry={true} onChangeText={setPassUser} onFocus={() => { handleErrorPass(); setFocused(true); }} />

                <View style={styles.rememberCover}>
                    <View style={styles.remember}>
                        <BouncyCheckbox
                            size={23}
                            fillColor={color.green}
                            unfillColor={color.white}
                            iconStyle={{ borderColor: color.green }}
                            innerIconStyle={{ borderWidth: 2 }}
                        />
                        <Text style={{ color: color.gray }}>Remember me</Text>
                    </View>

                    <Text style={{ color: color.green }}>Forgot the Password ?</Text>
                </View>

                <TouchableOpacity style={styles.buttonLogin} onPress={Validate}>
                    <Text style={styles.textLogin}>Login</Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity style={styles.continue} onPress={clickRegister}>
                <Text style={{ color: color.gray }}>don't have an account ? <Text style={{ color: color.green }}>Sign Up</Text></Text>
            </TouchableOpacity>

        </View>
    )
}

export default Login

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
    buttonLogin: {
        backgroundColor: color.green,
        height: 48,
        borderRadius: 10,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textLogin: {
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
