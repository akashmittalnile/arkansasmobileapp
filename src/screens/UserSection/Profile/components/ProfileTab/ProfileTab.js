//import : react components
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  Switch,
  TouchableOpacity,
  Dimensions,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
//import : custom components
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
//import : third parties
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
//import : global
import {Colors, Constant, MyIcon, ScreenNames, Service} from 'global/Index';
//import : styles
import {styles} from './ProfileStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
import NameEnterValue from '../../../../../components/NameEnterValue/NameEnterValue';
import MyButton from '../../../../../components/MyButton/MyButton';
// import {WebView} from 'react-native-webview';

const ProfileTab = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  company,
  setCompany,
  professionalTitle,
  setProfessionalTitle,
  timezone,
  setTimezone,
  lastNameRef,
  emailRef,
  companyRef,
  professionalTitleRef,
  timezoneRef,
}) => {
  return (
    <View style={{marginTop: 31}}>
      <NameEnterValue
        name={'First Name'}
        placeholder={'First Name'}
        value={firstName}
        setValue={setFirstName}
        onSubmitEditing={() => {
          lastNameRef.current.focus();
        }}
      />
      <NameEnterValue
        inputRef={lastNameRef}
        name={'Last Name'}
        placeholder={'Last Name'}
        value={lastName}
        setValue={setLastName}
        onSubmitEditing={() => {
          emailRef.current.focus();
        }}
      />
      <NameEnterValue
        inputRef={emailRef}
        name={'Email id'}
        placeholder={'Email id'}
        value={email}
        setValue={setEmail}
        onSubmitEditing={() => {
          companyRef.current.focus();
        }}
      />
      <NameEnterValue
        inputRef={companyRef}
        name={'Company'}
        placeholder={'Company'}
        value={company}
        setValue={setCompany}
        onSubmitEditing={() => {
          professionalTitleRef.current.focus();
        }}
      />
      <NameEnterValue
        inputRef={professionalTitleRef}
        name={'Professional Title'}
        placeholder={'Professional Title'}
        value={professionalTitle}
        setValue={setProfessionalTitle}
        onSubmitEditing={() => {
          timezoneRef.current.focus();
        }}
      />
      <NameEnterValue
        inputRef={timezoneRef}
        name={'Time Zone'}
        placeholder={'Time Zone'}
        value={timezone}
        setValue={setTimezone}
      />
      <MyButton
        text="SAVE CHANGES"
        style={{
          marginTop: 10,
          marginBottom: 10,
          backgroundColor: Colors.THEME_GOLD,
        }}
      />
      <MyButton
        text="CLEAR ALL"
        style={{
          marginBottom: 10,
          backgroundColor: Colors.THEME_BROWN,
        }}
      />
    </View>
  );
};

export default ProfileTab;
