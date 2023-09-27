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
  SafeAreaView,
  StatusBar,
} from 'react-native';
//import : custom components
import MyHeader from 'components/MyHeader/MyHeader';
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
//import : third parties
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
//import : global
import {Colors, Constant, MyIcon, ScreenNames, Service} from 'global/Index';
//import : styles
import {styles} from './NotificationsStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
// import {WebView} from 'react-native-webview';
import MyButton from '../../../components/MyButton/MyButton';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';
import OrdersFilter from '../../../modals/OrdersFilter/OrdersFilter';
import Review from '../../../modals/Review/Review';
import {THEME_BROWN} from '../../../global/Colors';

const courseData = [
  {
    id: '1',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 1,
  },
  {
    id: '2',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 2,
  },
  {
    id: '3',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 1,
  },
  {
    id: '4',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 5,
  },
  {
    id: '5',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 1,
  },
  {
    id: '6',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 4,
  },
  {
    id: '7',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 2,
  },
  {
    id: '8',
    name: 'The Art of Permanent Cosmetics-Graded',
    totalLessons: 5,
    completedLessons: 2,
  },
];

const notificationsData = [
  {
    id: '1',
    name: 'Course Successfully Purchased!',
    subtext: 'Order number #8787387',
    ago: '10h ago',
    type: 'purchased',
  },
  {
    id: '2',
    name: 'Course Successfully Purchased!',
    subtext: 'Order number #8787387',
    ago: '10h ago',
    type: 'purchased',
  },
  {
    id: '3',
    name: 'Password Changed Successfully',
    ago: '10h ago',
    type: 'password-changed',
  },
  {
    id: '4',
    name: 'Resume your course',
    subtext: 'Chapter 2: Tattoo Design …',
    ago: '10h ago',
    type: 'resume-course',
  },
  {
    id: '5',
    name: 'Order Placed',
    subtext: `O'Reilly's tattoo machine Motor`,
    ago: '10h ago',
    type: 'order-placed',
  },
  {
    id: '6',
    name: 'Shipped',
    subtext: `O'Reilly's tattoo machine Motor`,
    ago: '10h ago',
    type: 'shipped',
  },
  {
    id: '7',
    name: 'Out of delivery',
    subtext: `O'Reilly's tattoo machine Motor`,
    ago: '10h ago',
    type: 'out-of-delivery',
  },
  {
    id: '8',
    name: 'Delivered',
    subtext: `O'Reilly's tattoo machine Motor`,
    ago: '10h ago',
    type: 'delivered',
  },
];

const Notifications = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);

  const gotoHome = () => {
    navigation.navigate(ScreenNames.HOME);
  };

  const Icon = type => {
    let source = '';
    if (type.type === 'purchased') {
      source = require('assets/images/book.png');
    } else if (type.type === 'password-changed') {
      source = require('assets/images/password-changed.png');
    } else if (type.type === 'resume-course') {
      source = require('assets/images/resume-course.png');
    } else if (type.type === 'order-placed') {
      source = require('assets/images/order-placed.png');
    } else if (
      type.type === 'shipped' ||
      type.type === 'out-of-delivery' ||
      type.type === 'delivered'
    ) {
      source = require('assets/images/shipped.png');
    }
    return <Image source={source} />;
  };
  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Notifications" isBackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          style={styles.mainView}>
          {notificationsData?.length > 0 ? (
            notificationsData?.map(item => {
              return (
                <View style={styles.notiContainer}>
                  <Icon type={item.type} />
                  <View style={{marginLeft: 12, width: '65%'}}>
                    <MyText
                      text={item.name}
                      textColor={Colors.LIGHT_GREY}
                      fontSize={14}
                      fontFamily="medium"
                      style={{}}
                    />
                    {item.subtext ? (
                      <MyText
                        text={item.subtext}
                        textColor={Colors.LIGHT_GREY}
                        fontSise={13}
                        fontFamily="regular"
                        style={{}}
                      />
                    ) : null}
                  </View>
                  <MyText
                    text={item.ago}
                    textColor={Colors.LIGHT_GREY}
                    fontSise={14}
                    fontFamily="light"
                    style={{position: 'absolute', right: 10}}
                  />
                </View>
              );
            })
          ) : (
            <View style={{marginTop: 80, alignItems: 'center'}}>
              <View style={styles.iconBg}>
                <Image
                  source={require('assets/images/notification-bing.png')}
                />
              </View>
              <MyText
                text={'No Notification Yet'}
                textColor={'black'}
                fontSize={40}
                textAlign="center"
                fontFamily="medium"
                style={{}}
              />
              <MyText
                text={
                  'Stay Connected!  &  Informed with Our Notification Center'
                }
                textColor={Colors.LIGHT_GREY}
                fontSize={18}
                fontFamily="medium"
                textAlign="center"
                style={{marginTop: 10, marginBottom: 53}}
              />
              <MyButton
                text="Go Home"
                style={{
                  width: width * 0.9,
                  marginBottom: 10,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={gotoHome}
              />
            </View>
          )}
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(Notifications);
