//react components
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
//global
import {Colors, Constant, Images, ScreenNames} from 'global/Index';
//styles
import {styles} from './LoginStyle';
import {CommonActions} from '@react-navigation/native';
import MyText from 'components/MyText/MyText';
//third parties
import AsyncStorage from '@react-native-async-storage/async-storage';
//redux
import {useDispatch} from 'react-redux';
import {
  setUser,
  setUserToken,
  setUserNotifications,
} from 'src/reduxToolkit/reducer/user';
import LinearGradient from 'react-native-linear-gradient';
import MyButton from 'components/MyButton/MyButton';
import {width} from '../../../global/Constant';
import WelcomeHeader from 'components/WelcomeHeader/WelcomeHeader';
import MyTextInput from 'components/MyTextInput/MyTextInput';
import MyIconButton from 'components/MyIconButton/MyIconButton';
import Divider from '../../../components/Divider/Divider';
import TextInputWithFlag from '../../../components/TextInputWithFlag/TextInputWithFlag';
import {CountryPicker} from 'react-native-country-codes-picker';
import SuccessfulSignup from '../../../modals/SuccessfulSignup/SuccessfulSignup';

const Login = ({navigation}) => {
  //variables : redux variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);

  //function : navigation function
  const gotoSignUp = () => {
    navigation.navigate(ScreenNames.SIGN_UP);
  };
  const gotoForgotPasswordEmail = () => {
    navigation.navigate(ScreenNames.FORGOT_PASSWORD_EMAIL);
  };
  const resetIndexGoToBottomTab = CommonActions.reset({
    index: 1,
    routes: [{name: ScreenNames.BOTTOM_TAB}],
  });
  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            style={styles.mainView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: '20%'}}>
            <WelcomeHeader text="Login" />
            <MyText
              text={'Enter your login credentials'}
              fontSize={14}
              fontFamily="medium"
              textColor="black"
              style={{marginTop: 50, marginBottom: 25}}
            />
            <MyTextInput
              placeholder={'Email Address'}
              value={email}
              setValue={setEmail}
              isIcon
              icon={require('assets/images/email.png')}
              onSubmitEditing={() => passwordRef.current.focus()}
            />
            <MyTextInput
              inputRef={passwordRef}
              placeholder={'Password'}
              value={password}
              setValue={setPassword}
              isIcon
              icon={require('assets/images/password.png')}
              secureTextEntry
            />
            <TouchableOpacity
              onPress={gotoForgotPasswordEmail}
              style={styles.forgot}>
              <MyText
                text={'FORGOT PASSWORD'}
                fontSize={14}
                fontFamily="medium"
                textColor={Colors.THEME_GOLD}
                style={{marginTop: 5, marginBottom: 15}}
              />
            </TouchableOpacity>
            <MyButton
              text="NEXT"
              style={{
                width: width * 0.9,
                marginBottom: 10,
                backgroundColor: Colors.THEME_BROWN,
              }}
              onPress={() => {
                navigation.dispatch(resetIndexGoToBottomTab);
              }}
            />
            <View style={styles.dividerRow}>
              <Divider style={{width: '38%', borderColor: '#040706'}} />
              <View style={styles.orBox}>
                <MyText
                  text={'OR'}
                  fontSize={18}
                  fontFamily="bold"
                  textColor="white"
                />
              </View>
              <Divider style={{width: '38%', borderColor: '#040706'}} />
            </View>
            <MyIconButton
              text="Login with Facebook"
              isWhite
              style={{width: width * 0.9}}
              isIcon
              icon={require('assets/images/fb.png')}
            />
            <MyIconButton
              text="Login with Google"
              isWhite
              style={{width: width * 0.9}}
              isIcon
              icon={require('assets/images/google.png')}
            />
            <TouchableOpacity onPress={gotoSignUp} style={styles.alreadyView}>
              <MyText
                text={`Don't have an account?`}
                fontSize={13}
                fontFamily="medium"
                textColor={Colors.LIGHT_GREY}
              />
              <MyText
                text={'Signup'}
                fontSize={13}
                fontFamily="medium"
                textColor={'#B600F8'}
              />
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default Login;
