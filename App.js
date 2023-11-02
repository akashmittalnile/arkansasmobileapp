//import : react components
import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
  Text,
  LogBox,
  Linking,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
//import : notification
//import : third parties
//import : globals
import {Colors} from 'global/Index';
import Drawer from './src/navigation/Drawer/Drawer';
//import : redux
import {Provider} from 'react-redux';
import {store} from 'src/reduxToolkit/store/store';
import {StripeProvider} from '@stripe/stripe-react-native';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
//import : notification
import {NotificationAndroid} from './NotificationAndroid';
import {NotificationManagerIOS} from './NotificationManagerIOS';

const App = () => {
  // useEffect(() => {
  //   const handleDeepLink = async () => {
  //     const initialURL = await Linking.getInitialURL();
      
  //     if (initialURL) {
  //       Alert.alert(initialURL)
  //       // Parse the URL and extract parameters
  //       // Navigate to the appropriate screen based on the parameters
  //     }
  //   }
  
  //   // Add event listener for deep linking
  //   Linking.addEventListener('url', handleDeepLink);
  
  //   // Clean up the event listener when the component unmounts
  //   return () => {
  //     Linking.removeEventListener('url', handleDeepLink);
  //   };
  // }, []);
  //function
  const toastConfig = {
    success: props => (
      <BaseToast
        {...props}
        style={{
          borderLeftColor: Colors.THEME_GOLD,
          borderColor: Colors.THEME_GOLD,
          borderWidth: 1,
          height: 55,
          width: '90%',
        }}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 12,
          fontWeight: '400',
        }}
        // text2Style={{
        //   fontSize: 15,
        //   fontWeight: '400'

        // }}
      />
    ),
    error: props => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 12,
        }}
        text2Style={{
          fontSize: 12,
        }}
      />
    ),
  };
  async function requestUserPermission() {
    const authorizationStatus = await messaging().requestPermission({
      sound: false,
      announcement: true,
    });
  }
  async function requestUserPermissionIos() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  //variables : hook
  //hook : useEffect
  useEffect(() => {
    NotificationAndroid.createChannel();
    NotificationAndroid.configure();
    try {
      if (Platform.OS == 'android') {
        requestUserPermission();
      } else {
        requestUserPermissionIos();
      }
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        JSON.stringify(remoteMessage.data);
        const {messageId} = remoteMessage;
        const data = remoteMessage.notification;
        if (Platform.OS === 'android') {
          console.warn('data--->', data);
          NotificationAndroid.showNotification(
            data.title,
            data.body,
            data.subText,
            messageId,
            data,
          );
        } else {
          NotificationManagerIOS.showNotification(
            messageId,
            data.title,
            data.body,
            data,
            {},
          );
        }
      });
      return unsubscribe;
    } catch (error) {
      console.log(error.message);
    }
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      const {data, messageId} = remoteMessage;
      const {Title, notificationText, subText} = data;
      if (Platform.OS === 'android') {
        NotificationAndroid.showNotification(
          Title,
          notificationText,
          subText,
          messageId,
        );
      } else {
        NotificationManagerIOS.showNotification(
          messageId,
          Title,
          notificationText,
          data,
          {},
        );
      }
    });
  }, []);
  //UI
  return (
    <StripeProvider
      publishableKey="pk_test_4sjCZIFhfIeMDj3bpJsFapZf"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
      <Provider store={store}>
        <NavigationContainer>
          <Drawer />
          {/* <SafeAreaView style={{flex: 1}}>
          <StatusBar backgroundColor={Colors.THEME_BROWN} />
        </SafeAreaView> */}
          <Toast config={toastConfig} />
        </NavigationContainer>
      </Provider>
    </StripeProvider>
  );
};
export default App;
