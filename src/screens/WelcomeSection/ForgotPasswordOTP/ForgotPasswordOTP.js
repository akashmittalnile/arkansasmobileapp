//react components
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  SafeAreaView,
  StatusBar,
} from 'react-native';
//global
import {Colors, Constant, Images, ScreenNames} from 'global/Index';
//styles
import {styles} from './ForgotPasswordOTPStyle';
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

const ForgotPasswordOTP = ({navigation}) => {
  //variables : redux variables
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const [firstCode, setFirstCode] = useState('');
  const [secondCode, setSecondCode] = useState('');
  const [thirdCode, setThirdCode] = useState('');
  const [forthCode, setForthCode] = useState('');
  const [message, setMessage] = useState('');
  const firstCodeRef = useRef();
  const secondCodeRef = useRef();
  const thirdCodeRef = useRef();
  const forthCodeRef = useRef();

  //function : navigation function
  const gotoForgotPasswordChange = () => {
    navigation.navigate(ScreenNames.FORGOT_PASSWORD_CHANGE);
  };
  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <ScrollView
          style={styles.mainView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%', alignItems: 'center'}}>
          <WelcomeHeader text="Verification" right="38%" />
          <Image
            source={require('assets/images/lock-email-big-icon.png')}
            style={{marginTop: 40}}
          />
          <MyText
            text={'Verify your email'}
            fontSize={40}
            fontFamily="medium"
            textColor="black"
            textAlign="center"
            style={{}}
          />
          <MyText
            text={
              'Wohoo!!! Check your email we have sent you a verification code'
            }
            fontSize={18}
            fontFamily="medium"
            textColor={Colors.LIGHT_GREY}
            textAlign="center"
            style={{marginTop: 10, marginBottom: 18}}
          />
          <MyText
            text={'dandin.shvansh@hotmail.com'}
            fontSize={18}
            fontFamily="medium"
            textColor={Colors.LIGHT_GREY}
            textAlign="center"
            style={{marginBottom: 18}}
          />
          <View style={styles.flexRowView}>
            <TextInput
              placeholder=""
              ref={firstCodeRef}
              value={firstCode}
              onTouchStart={() => (message ? setMessage('') : null)}
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={text => {
                setFirstCode(text);
                if (text.length == 1) {
                  secondCodeRef.current.focus();
                } else {
                  firstCodeRef.current.focus();
                }
              }}
              onSubmitEditing={() => secondCodeRef.current.focus()}
              style={{
                ...styles.textInputStyle,
                color: firstCode == '' ? '#C0C0C0' : 'black',
              }}
            />
            <TextInput
              ref={secondCodeRef}
              value={secondCode}
              onTouchStart={() => (message ? setMessage('') : null)}
              placeholder={''}
              placeholderTextColor={
                secondCode == '' ? Colors.BLACK : Colors.WHITE
              }
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={text => {
                setSecondCode(text);
                if (text.length == 1) {
                  thirdCodeRef.current.focus();
                } else {
                  firstCodeRef.current.focus();
                }
              }}
              onSubmitEditing={() => thirdCodeRef.current.focus()}
              style={{
                ...styles.textInputStyle,
                color: secondCode == '' ? '#C0C0C0' : 'black',
              }}
            />
            <TextInput
              ref={thirdCodeRef}
              value={thirdCode}
              onTouchStart={() => (message ? setMessage('') : null)}
              placeholder={''}
              placeholderTextColor={
                thirdCode == '' ? Colors.BLACK : Colors.WHITE
              }
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={text => {
                setThirdCode(text);
                if (text.length == 1) {
                  forthCodeRef.current.focus();
                } else {
                  secondCodeRef.current.focus();
                }
              }}
              onSubmitEditing={() => forthCodeRef.current.focus()}
              style={{
                ...styles.textInputStyle,
                color: thirdCode == '' ? '#C0C0C0' : 'black',
              }}
            />
            <TextInput
              ref={forthCodeRef}
              value={forthCode}
              placeholder=""
              onTouchStart={() => (message ? setMessage('') : null)}
              placeholderTextColor={
                forthCode == '' ? Colors.BLACK : Colors.WHITE
              }
              maxLength={1}
              keyboardType="number-pad"
              onChangeText={text => {
                setForthCode(text);
                if (text.length == 1) {
                  Keyboard.dismiss();
                } else {
                  thirdCodeRef.current.focus();
                }
              }}
              style={{
                ...styles.textInputStyle,
                color: forthCode == '' ? '#C0C0C0' : 'black',
                marginRight: 0,
              }}
            />
          </View>
          {message ? (
            <MyText
              text={message}
              fontFamily="bold"
              textAlign="center"
              fontSize={16}
              textColor={'#fe0000'}
            />
          ) : null}
          <MyButton
            text="VALIDATE OTP"
            style={{
              width: width * 0.9,
              marginBottom: 10,
              backgroundColor: Colors.THEME_BROWN,
            }}
            onPress={gotoForgotPasswordChange}
          />
          <TouchableOpacity>
            <MyText
              text={'Resend Verification Code'}
              fontSize={18}
              fontFamily="medium"
              textColor={Colors.THEME_GOLD}
              textAlign="center"
              style={{marginTop: 8}}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordOTP;
