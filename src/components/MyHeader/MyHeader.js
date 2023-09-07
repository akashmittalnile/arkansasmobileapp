//import : react components
import React, {useCallback, useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, Keyboard} from 'react-native';
import {
  DrawerActions,
  useNavigation,
  useFocusEffect,
  CommonActions,
} from '@react-navigation/native';
//import : custom components
import MyText from 'components/MyText/MyText';
//import : global
import {Colors, Images, MyIcon, ScreenNames, Service} from 'global/Index';
//import : styles
import {styles} from './MyHeaderStyle';
//redux
import {useSelector, useDispatch} from 'react-redux';
import {logOutUser} from 'src/reduxToolkit/reducer/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

const personImg = `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`;

const MyHeader = ({
  Title,
  isBackButton = false,
  isBorderRadius = true,
  IsCartIcon = true,
  IsNotificationIcon = true,
}) => {
  //variables
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // const cartItems = useSelector(state => state.cart.cartItems);
  const cartItems = {};
  const userInfo = useSelector(state => state.user.userInfo);
  const userToken = useSelector(state => state.user.userToken);
  const userNotifications = useSelector(state => state.user.userNotifications);
  const [greetingMsg, setGreetingMsg] = useState('')

  useEffect(() => {
    getGreetingMessage()
  }, [])

  const getGreetingMessage = () => {
    const now = new Date();
    const hrs = now.getHours();
    let msg = "";

    if (hrs >= 0) msg = "Good Morning,";
    if (hrs >= 12) msg = "Good Afternoon,";
    if (hrs >= 16) msg = "Good Evening,";    
    setGreetingMsg(msg)
  }

  const resetIndexGoToWelcome = CommonActions.reset({
    index: 1,
    routes: [{name: ScreenNames.WELCOME}],
  });
  //function : navigation function
  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());
  const goBack = () => {
    Keyboard.dismiss();
    navigation.canGoBack() ? navigation.goBack() : console.log("can't go back");
  };
  const gotoNotification = () => navigation.navigate(ScreenNames.NOTIFICATIONS);
  const gotoCart = () => navigation.navigate(ScreenNames.CART);
  //UI
  return (
    <View
      style={[
        styles.container,
        {
          borderBottomLeftRadius: isBorderRadius ? 30 : 0,
          paddingBottom: isBackButton ? 73 : 63,
          borderBottomRightRadius: isBorderRadius ? 30 : 0,
        },
      ]}>
      {/* section first drawer and back icon  */}
      <TouchableOpacity onPress={isBackButton ? goBack : openDrawer}>
        {isBackButton ? (
          <Image source={require('assets/images/arrow-left-white.png')} />
        ) : (
          <View style={styles.leftContainer}>
            <Image
              resizeMode="contain"
              source={{uri: personImg}}
              style={styles.personImg}
            />
            <View style={{marginLeft: 10}}>
              <MyText
                // text={'Good Afternoon,'}
                text={greetingMsg}
                fontFamily="regular"
                fontSize={12}
                textColor="white"
                letterSpacing={-0.12}
              />
              <MyText
                text={`${userInfo?.first_name} ${userInfo?.last_name}`}
                fontFamily="regular"
                fontSize={20}
                textColor={Colors.THEME_GOLD}
                letterSpacing={-0.2}
                style={{marginTop: -5}}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
      {/* title section  */}
      {isBackButton ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: !IsCartIcon && !IsNotificationIcon ? 40 : 0,
          }}>
          <MyText
            text={Title}
            fontFamily="regular"
            fontSize={20}
            marginHorizontal={10}
            textColor="white"
            letterSpacing={-0.2}
          />
        </View>
      ) : null}
      {/* notification or cart icon  */}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {IsNotificationIcon ? (
          <TouchableOpacity
            onPress={gotoNotification}
            style={{marginRight: 10}}>
            {userNotifications?.length > 0 ? (
              <View style={styles.numNotiView}>
                <MyText
                  text={userNotifications?.length}
                  fontSize={10}
                  textColor="white"
                />
              </View>
            ) : null}
            {/* <MyText text={userNotifications?.length} fontSize={16} textColor="white" style={{position:"absolute", bottom:24, right:5, fontWeight:'bold'}}/> */}
            {/* <MyIcon.Feather name="bell" size={24} color={Colors.WHITE} /> */}
            <Image source={require('assets/images/notification.png')} />
          </TouchableOpacity>
        ) : null}
        {IsCartIcon ? (
          <TouchableOpacity onPress={gotoCart}>
            {Object.keys(typeof cartItems === 'object' ? cartItems : {})
              .length > 0 ? (
              <View style={styles.cartNumView}>
                <MyText text={1} fontSize={10} textColor="white" />
              </View>
            ) : null}
            <Image source={require('assets/images/cart.png')} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default MyHeader;
