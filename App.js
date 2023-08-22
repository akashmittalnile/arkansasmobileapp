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

const App = () => {
  //function
  //variables : hook
  //hook : useEffect
  //UI
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Drawer />
        {/* <SafeAreaView style={{flex: 1}}>
          <StatusBar backgroundColor={Colors.THEME_BROWN} />
        </SafeAreaView> */}
      </NavigationContainer>
    </Provider>
  );
};
export default App;
