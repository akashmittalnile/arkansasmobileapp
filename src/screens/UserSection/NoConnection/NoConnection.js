//import : react components
import React from 'react';
import {View, Text, Image, StyleSheet, Alert} from 'react-native';
import {CommonActions} from '@react-navigation/native';
//import : custom components
import MyText from '../../../components/MyText/MyText';
//import : third parties
import {useNetInfo} from '@react-native-community/netinfo';
//import : globals
import {Colors, ScreenNames} from '../../../global/Index';
//import : redux
import {useDispatch} from 'react-redux';
// import {CustomToastAction} from '../../redux/actions/actions';
import Toast from 'react-native-simple-toast';
import MyButton from 'components/MyButton/MyButton';
import { width } from '../../../global/Constant';

// saurabh saneja 1 Aug 23, if no internet connection show this screen
const NoConnection = ({navigation}) => {
  //variables
  const {isConnected, isInternetReachable} = useNetInfo();
  const dispatch = useDispatch();
  const resetIndexGoBottomTab = CommonActions.reset({
    index: 1,
    routes: [{name: ScreenNames.BOTTOM_TAB}],
  });
  //function
  const checkConnectivity = () => {
    if (isInternetReachable) {
      navigation.dispatch(resetIndexGoBottomTab);
    } else {
      Toast.show('Please check your internet connection and try again!', Toast.SHORT);
      // Alert.alert('Please check your internet connection and try again!')
      // dispatch(
      //   CustomToastAction.showToast(
      //     'Please check your internet connection and try again!',
      //   ),
      // );
    }
  };
  //UI
  return (
    <View
      style={{
        flex: 1,
      }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.WHITE,
        }}>
        <Image
          resizeMode="contain"
          source={require('assets/images/nonetwork.png')}
          style={{
            width: 200,
            height: 200,
            alignSelf: 'center',
          }}
        />
        <MyText
          text={'No internet connection !!'}
          fontFamily="black"
          fontSize={20}
          marginVertical={20}
        />
        <MyButton
          text="Go to Home"
          style={{
            width: width * 0.9,
            marginBottom: 10,
            backgroundColor: Colors.THEME_BROWN,
          }}
          onPress={checkConnectivity}
        />
        {/* <GoToButton text="Go to Home" backgroundColor={'#FC4A26'} textColor={'white'} style={{width:'90%'}} onPress={checkConnectivity} /> */}
      </View>
    </View>
  );
};

export default NoConnection;
