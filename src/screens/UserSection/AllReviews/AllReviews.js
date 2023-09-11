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
import {styles} from './AllReviewsStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
// import {WebView} from 'react-native-webview';
import MyButton from '../../../components/MyButton/MyButton';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import AccordionItem from '../../../components/AccordionItem/AccordionItem';
import ViewAll from '../../../components/ViewAll/ViewAll';
import FAB_Button from '../../../components/FAB_Button/FAB_Button';
import {createThumbnail} from 'react-native-create-thumbnail';

const reviewsData = [
  {
    id: '1',
    name: 'Annete Black',
    img: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`,
    msg: `Perfectly packed all products received as said...but when connected with power supply it doesn't work, After some adjustments it worked perfectly felt very happy with the product. Thank you`,
  },
  {
    id: '2',
    name: 'Annete Black',
    img: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`,
    msg: `Perfectly packed all products received as said...but when connected with power supply it doesn't work, After some adjustments it worked perfectly felt very happy with the product. Thank you`,
  },
];
const AllReviews = ({navigation, dispatch, route}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [reviewList, setReviewList] = useState([]);

  useEffect(() => {
    getReviewList();
  }, []);
  const getReviewList = async () => {
    const postData = new FormData();
    postData.append('type', route?.params?.type);
    postData.append('id', route?.params?.id);
    console.log('getReviewList postData', postData);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.REVIEW_LIST,
        postData,
      );
      console.log('getReviewList resp', resp?.data);
      if (resp?.data?.status) {
        const data = await generateThumb(resp?.data?.data);
        setReviewList(data);
        // Toast.show(resp?.data?.message, Toast.SHORT)
      } else {
        Toast.show(resp?.data?.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in getReviewList', error);
    }
    setShowLoader(false);
  };

  const generateThumb = async data => {
    console.log('generateThumb');
    try {
      const thumb = await createThumbnail({
        url: data.introduction_video,
        timeStamp: 1000,
      });
      data.thumb = thumb;
      console.log('generateThumb data', data);
      return data;
    } catch (error) {
      console.error('Error generating thumbnails:', error);
    }
  };

  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Home" />
        {/* <MyHeader Title="Home" isBackButton /> */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          style={styles.mainView}>
          <View style={{height: 37}}></View>
          <ViewAllSub
            text="Rating & Review"
            rating="4.7"
            reviews="400k+"
            showButton={false}
            style={{marginBottom: 17}}
          />
          {reviewList?.length > 0 ? (
            reviewList?.map(item => (
              <View key={item.id} style={styles.reviewContainer}>
                <View style={styles.reviewTopRow}>
                  <View style={styles.reviewTopLeftRow}>
                    <Image source={{uri: item.img}} style={styles.reviewImg} />
                    <MyText
                      text={item.name}
                      fontFamily="medium"
                      fontSize={13}
                      textColor={Colors.LIGHT_GREY}
                      style={{marginLeft: 10}}
                    />
                  </View>
                  <Image source={require('assets/images/message-text.png')} />
                </View>
                <MyText
                  text={item.msg}
                  fontFamily="medium"
                  fontSize={13}
                  textColor={Colors.LIGHT_GREY}
                  style={{marginTop: 10}}
                />
              </View>
            ))
          ) : (
            <MyText
              text={`No Trending Courses found`}
              fontFamily="medium"
              fontSize={18}
              textColor={'#455A64'}
              style={{textAlign: 'center', marginTop: 20}}
            />
          )}

          <FAB_Button />
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(AllReviews);

const ViewAllSub = ({
  text,
  rating,
  reviews,
  onPress,
  style = {},
  buttonText = 'See All',
  showButton = true,
}) => {
  return (
    <View style={[styles.viewAllContainer, style]}>
      <View>
        <MyText
          text={text}
          fontFamily="medium"
          fontSize={18}
          textColor={'#455A64'}
        />
        <View style={styles.ratingView}>
          <Image
            source={require('assets/images/selected-star.png')}
            style={{height: 10, width: 10}}
          />
          <MyText
            text={rating}
            fontSize={13}
            fontFamily="regular"
            textColor={Colors.LIGHT_GREY}
            style={{marginLeft: 5}}
          />
          <MyText
            text={'(' + reviews + ')'}
            fontSize={13}
            fontFamily="regular"
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
        </View>
      </View>
      {showButton ? (
        <TouchableOpacity onPress={onPress} style={styles.viewAll}>
          <MyText
            text={buttonText}
            fontFamily="regular"
            fontSize={13}
            textColor={Colors.THEME_GOLD}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
