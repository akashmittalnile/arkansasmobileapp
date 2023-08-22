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
  ImageBackground,
  TouchableWithoutFeedback,
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
import {styles} from './BillingTabStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
import NameEnterValue from '../../../../../components/NameEnterValue/NameEnterValue';
import MyButton from '../../../../../components/MyButton/MyButton';
import ViewAll from '../../../../../components/ViewAll/ViewAll';
// import {WebView} from 'react-native-webview';

const BillingTab = ({cardList, deleteCard, openAddCardModal}) => {
  return (
    <View style={{}}>
      <ViewAll
        text="Saved Cards"
        buttonText="Add New"
        style={{marginTop: 25, marginBottom: 21}}
        onPress={openAddCardModal}
      />
      {cardList?.map(item => (
        <View key={item.id} style={[styles.cardContainer]}>
          <View style={styles.cardContainerLeftRow}>
            <Image source={item.img} style={{}} />
            <View style={{marginLeft: 12}}>
              <MyText
                text={'**** **** **** ' + item.cardNum.slice(-5)}
                fontSize={16}
                fontFamily="medium"
                textColor={'#261313'}
              />
              <MyText
                text={`Expires ${item.expires}`}
                fontSize={14}
                fontFamily="light"
                textColor={Colors.LIGHT_GREY}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              deleteCard(item.id);
            }}>
            <Image source={require('assets/images/trash.png')} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default BillingTab;
