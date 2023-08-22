//react components
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
//global
import {Colors, Constant, Images, ScreenNames} from 'global/Index';
//styles
import {styles} from './ForgotPasswordEmailStyle';
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

const ForgotPasswordEmail = ({navigation}) => {
  //variables : redux variables
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();

  //function : navigation function
  const gotoForgotPasswordOTP = () => {
    navigation.navigate(ScreenNames.FORGOT_PASSWORD_OTP);
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
          <WelcomeHeader text="Forgot Password" right="33%" />
          <Image
            source={require('assets/images/lock-circle-big-icon.png')}
            style={{marginTop: 40}}
          />
          <MyText
            text={'Forgot Password'}
            fontSize={40}
            fontFamily="medium"
            textColor="black"
            textAlign="center"
            style={{}}
          />
          <MyText
            text={'We Will Send An 4 Digit OTP In Your Registered Email ID'}
            fontSize={18}
            fontFamily="medium"
            textColor={Colors.LIGHT_GREY}
            textAlign="center"
            style={{marginTop: 10, marginBottom: 30}}
          />
          <MyTextInput
            placeholder={'Email Address'}
            value={email}
            setValue={setEmail}
            isIcon
            icon={require('assets/images/email.png')}
          />
          <MyButton
            text="RESET PASSWORD"
            style={{
              width: width * 0.9,
              marginBottom: 10,
              backgroundColor: Colors.THEME_BROWN,
            }}
            onPress={gotoForgotPasswordOTP}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordEmail;
