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
import {styles} from './MyOrdersStyle';
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

const courseList = [
  {
    id: '1',
    creatorName: `Max Bryrant`,
    courseImg: require('assets/images/rectangle-1035.png'),
    courseName: 'Tattoo Cover-Ups & Transformations',
    courseRating: '4.7',
    courseFee: '399.00',
    status: 'Completed',
    courseValidDate: '26 Juny 2023',
    courseCompletedDate: '26 Juny 2023 9:30AM',
  },
  {
    id: '2',
    creatorName: `Max Bryrant`,
    courseImg: require('assets/images/rectangle-1035.png'),
    courseName: 'Tattoo Cover-Ups & Transformations',
    courseRating: '4.7',
    courseFee: '399.00',
    status: 'Ongoing',
    courseValidDate: '26 Juny 2023',
    courseCompletedDate: '26 Juny 2023 9:30AM',
  },
];
const productList = [
  {
    id: '1',
    creatorName: `Max Bryrant`,
    courseImg: require('assets/images/prod-img-1.png'),
    courseName: `O'Reilly's tattoo machine Motor`,
    courseRating: '4.7',
    courseFee: '399.00',
    status: 'Picked-up',
    orderId: 'HBD898DMND8333',
    date: '26 Juny 2023 9:30AM',
  },
  {
    id: '2',
    creatorName: `Nikhil Sam`,
    courseImg: require('assets/images/prod-img-2.png'),
    courseName: `O'Reilly's tattoo machine Motor`,
    courseRating: '4.7',
    courseFee: '399.00',
    status: 'Packed',
    orderId: 'HBD898DMND8333',
    courseCompletedDate: '26 Juny 2023 9:30AM',
    date: '26 Juny 2023 9:30AM',
  },
];

const MyOrders = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [showOrdersFilterModal, setShowOrdersFilterModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedTab, setSelectedTab] = useState('1');
  const [selectedId, setSelectedId] = useState('1');
  const [selectedType, setSelectedType] = useState(null);
  const [review, setReview] = useState('');
  const [tabs, setTabs] = useState([
    {
      id: '1',
      name: 'Course',
    },
    {
      id: '2',
      name: 'Products',
    },
  ]);
  const [orderTypes, setOrderTypes] = useState([
    {
      id: '1',
      name: 'All',
    },
    {
      id: '2',
      name: 'Ongoing',
    },
    {
      id: '3',
      name: 'Pickup',
    },
  ]);
  const [subjects, setSubjects] = useState([
    {
      id: '1',
      name: 'Permanent Makeup Training',
    },
    {
      id: '2',
      name: 'Tattooing & Piercing Institute',
    },
  ]);
  const [dateUploaded, setDateUploaded] = useState([
    {
      id: '1',
      name: 'This Week',
    },
    {
      id: '2',
      name: 'This Month',
    },
    {
      id: '3',
      name: 'This Year',
    },
  ]);
  const [selectedOrderType, setSelectedOrderType] = useState('1');
  const [selectedSubject, setSelectedSubject] = useState('1');
  const [selectedDateUploaded, setSelectedDateUploaded] = useState('1');
  const [multiSliderValue, setMultiSliderValue] = useState([0, 5000]);
  const [starRating, setStarRating] = useState(1);
  const [courseData, setCourseData] = useState([]);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyOrders();
   });
   return unsubscribe;
 }, [navigation]);
 const getMyOrders = async (type = '1') => {
   setShowLoader(true);
   const formdata = new FormData();
   formdata.append('type', type);
   try {
     const resp = await Service.postApiWithToken(
       userToken,
       Service.MY_ORDER,
       formdata,
     );
     console.log('getMyOrders resp', resp?.data);
     if (resp?.data?.status) {
       if (type === '1') {
        //  const updatedData = await generateThumb(resp?.data?.data)
        //  setCourseData(updatedData);
         setCourseData(resp?.data?.data);
       } else {
         setProductData(resp?.data?.data);
       }
     } else {
       Toast.show(resp.data.message, Toast.SHORT);
     }
   } catch (error) {
     console.log('error in getMyOrders', error);
   }
   setShowLoader(false);
 };

  const multiSliderValuesChange = values => {
    setMultiSliderValue(values);
  };

  const openOrdersFilterModal = () => {
    setShowOrdersFilterModal(true);
  };
  const openReviewModal = (id, type) => {
    setSelectedId(id)
    setSelectedType(type)
    setShowReviewModal(true);
  };

  const onClearFilter = () => {};

  const onApplyFilter = () => {};

  const changeOrderTypes = id => {
    setSelectedOrderType(id);
  };
  const changeSubjects = id => {
    setSelectedSubject(id);
  };
  const changeDateUploaded = id => {
    setSelectedDateUploaded(id);
  };

  const changeSelectedTab = id => {
    setSelectedTab(id);
  };

  const gotoStartCourse = () => {
    navigation.navigate(ScreenNames.START_COURSE);
  };

  const submitReview = async () => {
    if(review?.trim()?.length === 0){
      Toast.show('Please enter review')
      return
    }
    const postData = new FormData()
    postData.append('id', selectedId)
    postData.append('type', selectedType)
    postData.append('message', review)
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.SUBMIT_REVIEW,
        postData,
      );
      console.log('submitReview resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show(resp?.data?.message, Toast.SHORT)
        setStarRating(1)
        setReview('')
      }else{
        Toast.show(resp?.data?.message, Toast.SHORT)
      }
    } catch (error) {
      console.log('error in submitReview', error);
    }
    setShowLoader(false);
  };

  const renderCourse = ({item}) => {
    return (
      <View style={styles.courseContainer}>
        <View style={styles.courseTopRow}>
          <MyText
            text={`Course Valid Date: ${item.courseValidDate}`}
            fontFamily="medium"
            fontSize={12}
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <MyText
              text={item.status}
              fontFamily="medium"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{marginLeft: 5}}
            />
          </View>
        </View>
        <View style={styles.courseSubContainer}>
          <ImageBackground
            source={item.courseImg}
            style={styles.crseImg}
            imageStyle={{borderRadius: 10}}></ImageBackground>
          <View style={{marginLeft: 11, width: width * 0.55}}>
            <MyText
              text={item.courseName}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{}}
            />
            <View style={styles.middleRow}>
              <View style={styles.ratingRow}>
                <Image source={require('assets/images/star.png')} />
                <MyText
                  text={item.courseRating}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.LIGHT_GREY}
                  letterSpacing={0.13}
                  style={{marginLeft: 5}}
                />
              </View>
              <View style={styles.crtrRow}>
                <Image
                  source={require('assets/images/profile-circle.png')}
                  // style={styles.crtrImg}
                />
                <MyText
                  text={item.creatorName}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.THEME_GOLD}
                  letterSpacing={0.13}
                  style={{marginLeft: 10}}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={gotoStartCourse}
              style={styles.courseButton}>
              <Image source={require('assets/images/play.png')} />
              <MyText
                text={
                  item.status === 'Completed' ? 'Start over again' : 'Resume'
                }
                fontFamily="medium"
                fontSize={13}
                textColor={Colors.THEME_GOLD}
                letterSpacing={0.13}
                style={{marginLeft: 5}}
              />
            </TouchableOpacity>
            {item.status === 'Completed' ? (
              <MyButton
                text="WRITE YOUR REVIEW HERE"
                style={{
                  width: '90%',
                  height: 40,
                  marginTop: 8,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={()=>openReviewModal(item?.id, '1')}
              />
            ) : null}
            {/* <View style={styles.bottomRow}>
              <MyText
                text={'$' + item.courseFee}
                fontFamily="bold"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                letterSpacing={0.14}
                style={{}}
              />
              <View style={styles.iconsRow}>
                <Image source={require('assets/images/heart-selected.png')} />
                <Image
                  source={require('assets/images/share.png')}
                  style={{marginLeft: 10}}
                />
              </View>
            </View> */}
          </View>
        </View>
        <Divider
          style={{borderColor: '#ECECEC', marginTop: 11, marginBottom: 5}}
        />
        <MyText
          text={`Course Completed Date: ${item.courseCompletedDate}`}
          fontFamily="medium"
          fontSize={12}
          textColor={Colors.LIGHT_GREY}
          style={{}}
        />
      </View>
    );
  };
  const renderProduct = ({item}) => {
    return (
      <View style={styles.courseContainer}>
        <View style={styles.courseTopRow}>
          <MyText
            text={`Order ID: ${item.orderId}`}
            fontFamily="medium"
            fontSize={12}
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <MyText
              text={item.status}
              fontFamily="medium"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{marginLeft: 5}}
            />
          </View>
        </View>
        <View style={styles.courseSubContainer}>
          <ImageBackground source={item.courseImg} style={styles.crseImg}>
            {/* <TouchableOpacity>
            <Image source={require('assets/images/play-icon.png')} />
          </TouchableOpacity> */}
          </ImageBackground>
          <View style={{marginLeft: 11, width: width * 0.5}}>
            <MyText
              text={item.courseName}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{}}
            />
            <View style={styles.middleRow}>
              <View style={styles.ratingRow}>
                <Image source={require('assets/images/star.png')} />
                <MyText
                  text={item.courseRating}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.LIGHT_GREY}
                  letterSpacing={0.13}
                  style={{marginLeft: 5}}
                />
              </View>
              <View style={styles.crtrRow}>
                <Image
                  source={require('assets/images/profile-circle.png')}
                  // style={styles.crtrImg}
                />
                <MyText
                  text={item.creatorName}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.THEME_GOLD}
                  letterSpacing={0.13}
                  style={{marginLeft: 10}}
                />
              </View>
            </View>
            <View style={styles.bottomRow}>
              <MyText
                text={'$' + item.courseFee}
                fontFamily="bold"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                letterSpacing={0.14}
                style={{}}
              />
              <View style={styles.iconsRow}>
                <Image source={require('assets/images/heart-selected.png')} />
                <Image
                  source={require('assets/images/share.png')}
                  style={{marginLeft: 10}}
                />
              </View>
            </View>
            {item.status === 'Picked-up' ? (
              <MyButton
                text="WRITE YOUR REVIEW HERE"
                style={{
                  // width: '90%',
                  height: 40,
                  marginTop: 8,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={()=>openReviewModal(item?.id, '2')}
              />
            ) : null}
          </View>
        </View>
        <Divider
          style={{borderColor: '#ECECEC', marginTop: 11, marginBottom: 5}}
        />
        <MyText
          text={item.date}
          fontFamily="medium"
          fontSize={12}
          textColor={Colors.LIGHT_GREY}
          style={{}}
        />
      </View>
    );
  };
  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          style={styles.mainView}>
          <SearchWithIcon
            value={searchValue}
            setValue={setSearchValue}
            icon={<Image source={require('assets/images/filter.png')} />}
            placeholder="Search..."
            onPress={openOrdersFilterModal}
            // style={{
            //   width: Constant.width - 40,
            //   alignSelf: 'center',
            //   marginTop: -25,
            // }}
          />
          <View style={styles.tabsContainer}>
            {tabs?.map(item => (
              <TouchableOpacity
                onPress={() => changeSelectedTab(item.id)}
                style={[
                  styles.tab,
                  selectedTab === item.id
                    ? {backgroundColor: Colors.THEME_GOLD}
                    : null,
                ]}>
                <MyText
                  text={item.name}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={
                    selectedTab === item.id ? 'white' : Colors.THEME_BROWN
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
          {selectedTab === '1' ? (
            <FlatList
              data={courseList}
              style={{marginTop: 28}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderCourse}
            />
          ) : (
            <FlatList
              data={productList}
              style={{marginTop: 28}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderProduct}
            />
          )}
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
        <OrdersFilter
          visible={showOrdersFilterModal}
          setVisibility={setShowOrdersFilterModal}
          onClearFilter={onClearFilter}
          onApplyFilter={onApplyFilter}
          orderTypes={orderTypes}
          subjects={subjects}
          dateUploaded={dateUploaded}
          changeOrderTypes={changeOrderTypes}
          changeSubjects={changeSubjects}
          changeDateUploaded={changeDateUploaded}
          selectedOrderType={selectedOrderType}
          selectedSubject={selectedSubject}
          selectedDateUploaded={selectedDateUploaded}
          multiSliderValue={multiSliderValue}
          multiSliderValuesChange={multiSliderValuesChange}
        />
        <Review
          visible={showReviewModal}
          setVisibility={setShowReviewModal}
          starRating={starRating}
          setStarRating={setStarRating}
          review={review}
          setReview={setReview}
          submitReview={submitReview}
        />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(MyOrders);
