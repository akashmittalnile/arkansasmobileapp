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
import {styles} from './SignupStyle';
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

const Signup = ({navigation}) => {
  //variables : redux variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'US',
    dial_code: '+1',
    flag: '🇺🇸',
    name: {
      by: '',
      cz: 'Spoj  ené státy',
      en: 'United States',
      es: 'Estados Unidos',
      pl: 'Stany Zjednoczone',
      pt: 'Estados Unidos',
      ru: 'Соединенные Штаты',
      ua: 'Сполучені Штати',
    },
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const dispatch = useDispatch();
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);

  const openSuccessModal = () => {
    setShowSuccessModal(true);
  };
  //function : navigation function
  const gotoLogin = () => {
    navigation.navigate(ScreenNames.LOGIN);
  };
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
            <WelcomeHeader text="Sign Up" right="42%" />
            <MyText
              text={'Please enter your basic details'}
              fontSize={14}
              fontFamily="medium"
              textColor="black"
              style={{marginTop: 50, marginBottom: 25}}
            />
            <MyTextInput
              placeholder={'Name'}
              value={name}
              setValue={setName}
              isIcon
              icon={require('assets/images/user.png')}
              onSubmitEditing={() => emailRef.current.focus()}
            />
            <MyTextInput
              inputRef={emailRef}
              placeholder={'Email Address'}
              value={email}
              setValue={setEmail}
              isIcon
              icon={require('assets/images/email.png')}
              onSubmitEditing={() => phoneRef.current.focus()}
            />
            <TextInputWithFlag
              inputRef={phoneRef}
              value={phone}
              Flag={selectedCountry.flag}
              CountryCode={selectedCountry.dial_code}
              placeholder="Enter Phone Number"
              keyboardType="number-pad"
              maxLength={10}
              onPress={() => setShow(true)}
              onChangeText={text => setPhone(text)}
              onSubmitEditing={() => passwordRef.current.focus()}
            />
            {/* <MyTextInput
          inputRef={phoneRef}
          placeholder={'Phone'}
          value={phone}
          setValue={setPhone}
          isIcon
          icon={require('assets/images/phone.png')}
          onSubmitEditing={() => passwordRef.current.focus()}
        /> */}
            <MyTextInput
              inputRef={passwordRef}
              placeholder={'Password'}
              value={password}
              setValue={setPassword}
              isIcon
              icon={require('assets/images/password.png')}
              secureTextEntry
            />
            <MyButton
              text="NEXT"
              style={{
                width: width * 0.9,
                marginBottom: 10,
                backgroundColor: Colors.THEME_BROWN,
              }}
              onPress={openSuccessModal}
            />
            <View style={styles.dividerRow}>
              <Divider style={{width: '38%'}} />
              <View style={styles.orBox}>
                <MyText
                  text={'OR'}
                  fontSize={18}
                  fontFamily="bold"
                  textColor="white"
                />
              </View>
              <Divider style={{width: '38%'}} />
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
            <TouchableOpacity onPress={gotoLogin} style={styles.alreadyView}>
              <MyText
                text={'Already have an account?'}
                fontSize={13}
                fontFamily="medium"
                textColor={Colors.LIGHT_GREY}
              />
              <MyText
                text={'Signin'}
                fontSize={13}
                fontFamily="medium"
                textColor={'#B600F8'}
              />
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
        <SuccessfulSignup
          visible={showSuccessModal}
          setVisibility={setShowSuccessModal}
          gotoLogin={gotoLogin}
        />
        <CountryPicker
          show={show}
          disableBackdrop={false}
          // style={styles.countrySilderStyle}
          style={{
            // Styles for whole modal [View]
            modal: {
              height: Constant.height * 0.4,
              // backgroundColor: 'red',
            },
            // Styles for modal backdrop [View]
            backdrop: {},
            countryName: {
              color: 'black',
            },
            dialCode: {
              color: 'black',
            },
          }}
          // when picker button press you will get the country object with dial code
          pickerButtonOnPress={item => {
            // console.warn('item', item);
            // setCountryCode(item.dial_code);
            setSelectedCountry(item);
            setShow(false);
          }}
          placeholderTextColor={'#c9c9c9'}
          color={Colors.BLACK}
          onBackdropPress={() => setShow(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Signup;
