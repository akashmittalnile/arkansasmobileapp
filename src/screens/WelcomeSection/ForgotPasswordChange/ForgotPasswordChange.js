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
import {styles} from './ForgotPasswordChangeStyle';
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

const ForgotPasswordChange = ({navigation}) => {
  //variables : redux variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const confirmPasswordRef = useRef(null);

  //function : navigation function
  const resetIndexGoToLogin = CommonActions.reset({
    index: 1,
    routes: [{name: ScreenNames.LOGIN}],
  });
  const gotoLogin = () => {
    navigation.dispatch(resetIndexGoToLogin);
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
            contentContainerStyle={{
              paddingBottom: '20%',
              alignItems: 'center',
            }}>
            <WelcomeHeader text="Change Password" right="33%" />
            <Image
              source={require('assets/images/lock-circle-big-icon-2.png')}
              style={{marginTop: 40}}
            />
            <MyText
              text={'Change Password'}
              fontSize={40}
              fontFamily="medium"
              textColor="black"
              textAlign="center"
              style={{}}
            />
            <MyText
              text={
                'Your new password must be different from previously used password'
              }
              fontSize={18}
              fontFamily="medium"
              textColor={Colors.LIGHT_GREY}
              textAlign="center"
              style={{marginTop: 10, marginBottom: 30}}
            />
            <MyTextInput
              placeholder={'Password'}
              value={password}
              setValue={setPassword}
              isIcon
              icon={require('assets/images/password.png')}
              secureTextEntry
              onSubmitEditing={() => confirmPasswordRef.current.focus()}
            />
            <MyTextInput
              inputRef={confirmPasswordRef}
              placeholder={'Confirm Password'}
              value={confirmPassword}
              setValue={setConfirmPassword}
              isIcon
              icon={require('assets/images/password.png')}
              secureTextEntry
            />
            <MyButton
              text="SAVE PASSWORD"
              style={{
                width: width * 0.9,
                marginBottom: 10,
                backgroundColor: Colors.THEME_BROWN,
              }}
              onPress={gotoLogin}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordChange;
