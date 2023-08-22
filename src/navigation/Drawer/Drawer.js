//react components
import React from 'react';
//navigation
import {createDrawerNavigator} from '@react-navigation/drawer';
//global
import {Colors, Constant, ScreenNames} from 'global/Index';
//stack
import MainStack from '../MainStack/MainStack.js';
import CustomDrawer from './CustomDrawer';
import {SafeAreaView} from 'react-native';

const Drawer = () => {
  //variables
  const Drawer = createDrawerNavigator();
  const initialRouteName = ScreenNames.MAIN_STACK;
  const options = {
    swipeEnabled: false,
  };
  //function : render function
  const renderCustomDrawer = ({navigation}) => (
    <SafeAreaView style={{flex: 1}}>
      <CustomDrawer navigation={navigation} />
    </SafeAreaView>
  );
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          // backgroundColor: Colors.LITE_GREY,
          // width: Constant.width,
        },
      }}
      initialRouteName={initialRouteName}
      drawerContent={renderCustomDrawer}>
      <Drawer.Screen
        name={ScreenNames.MAIN_STACK}
        options={options}
        component={MainStack}
      />
    </Drawer.Navigator>
  );
};

export default Drawer;
