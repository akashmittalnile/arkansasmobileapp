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
import {styles} from './CourseCompletedScreenStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
// import {WebView} from 'react-native-webview';
import MyButton from '../../../components/MyButton/MyButton';
import ProgressCircle from 'react-native-progress-circle';

const CourseCompletedScreen = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [showCourseCompletedModal, setShowCourseCompletedModal] =
    useState(false);
  const [showRescheduleTestModal, setShowRescheduleTestModal] = useState(false);

  const gotoCourseList = () => {
    navigation.navigate(ScreenNames.COURSE_LIST);
  };
  const openCourseCompletedModal = () => {
    setShowCourseCompletedModal(true);
  };
  const openRescheduleTestModal = () => {
    setShowRescheduleTestModal(true);
  };

  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Disclaimers Video" isBackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%', alignItems: 'center'}}
          style={styles.mainView}>
          <View style={{marginTop: 30}}></View>
          <ProgressCircle
            percent={95}
            radius={100}
            borderWidth={8}
            color={Colors.THEME_GOLD}
            shadowColor="#ECECEC"
            bgColor="#fff">
            <MyText
              text="95%"
              textColor="black"
              fontSize={27}
              fontFamily="medium"
            />
            <MyText
              text="OVERALL SCORE"
              textColor="black"
              fontSize={14}
              fontFamily="medium"
            />
          </ProgressCircle>
          <MyText
            text="Congratulations!"
            fontSize={24}
            fontFamily="medium"
            textColor={Colors.THEME_GOLD}
            style={{marginTop: 30}}
          />
          <MyText
            text="Test pass"
            fontSize={18}
            fontFamily="regular"
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
          <MyText
            text="USED 00:30:00"
            fontSize={12}
            fontFamily="medium"
            textColor={Colors.LIGHT_GREY}
            style={{marginTop: 10}}
          />
          <View style={styles.dateTimeRow}>
            <StartEndTime
              date="MAY 24, 2023"
              time="6:53 AM"
              style={{width: '48%'}}
            />
            <StartEndTime
              date="MAY 24, 2023"
              time="6:53 AM"
              style={{width: '48%'}}
            />
          </View>
          <MyButton
            text="RETURN TO COURSE"
            style={{
              marginTop: 60,
              backgroundColor: Colors.THEME_BROWN,
            }}
            textColor={Colors.THEME_GOLD}
          />
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(CourseCompletedScreen);

const StartEndTime = ({date, time, style}) => {
  return (
    <View style={[styles.startEndTimeContainer, style]}>
      <View style={styles.startEndTimeTopContainer}>
        <MyText
          text={date}
          fontSize={14}
          fontFamily="medium"
          textColor={'white'}
          style={{}}
        />
      </View>
      <View>
        <MyText
          text={time}
          fontSize={14}
          fontFamily="medium"
          textColor={Colors.LIGHT_GREY}
          style={{}}
        />
        <MyText
          text="(UTC)"
          fontSize={12}
          fontFamily="medium"
          textAlign="center"
          textColor={'#ECECEC'}
          style={{marginTop: 10, marginBottom: 5}}
        />
      </View>
    </View>
  );
};
