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

const App = () => {
  //function
  //variables : hook
  //hook : useEffect
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
        </NavigationContainer>
      </Provider>
    </StripeProvider>
  );
};
export default App;
