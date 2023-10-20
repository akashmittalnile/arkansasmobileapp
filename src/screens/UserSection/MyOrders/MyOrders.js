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
import {createThumbnail} from 'react-native-create-thumbnail';
import moment from 'moment';
import DatePicker from 'react-native-date-picker';

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
  const [showFilterModal, setShowFilterModal] = useState(false);
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

  const [courseCategries, setCourseCategries] = useState([]);
  const [selectedCourseCategries, setSelectedCourseCategries] = useState([]);
  const [tempSelectedCourseCategries, setTempSelectedCourseCategries] =
    useState([]);
  const [productCategries, setProductCategries] = useState([]);
  const [selectedProductCategries, setSelectedProductCategries] = useState([]);
  const [TempSelectedProductCategries, setTempSelectedProductCategries] =
    useState([]);
  const [selectedRatingValues, setSelectedRatingValues] = useState([]);
  const [tempSelectedRatingValues, setTempSelectedRatingValues] = useState([]);
  const [temporarySelectedTab, setTemporarySelectedTab] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tempStartDate, setTempStartDate] = useState('');
  const [openTempStartDate, setOpenTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  const [openTempEndDate, setOpenTempEndDate] = useState('');

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
          const updatedData = await generateThumb(resp?.data?.data);
          setCourseData(updatedData);
        } else {
          setProductData(resp?.data?.data);
        }
        if (resp?.data?.category) {
          setCourseCategries(
            resp?.data?.category?.filter(el => el?.type == '1'),
          );
          setProductCategries(
            resp?.data?.category?.filter(el => el?.type == '2'),
          );
        }
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in getMyOrders', error);
    }
    setShowLoader(false);
  };
  const generateThumb = async data => {
    // console.log('generateThumb');
    let updatedData = [...data];
    try {
      updatedData = await Promise.all(
        data?.map?.(async el => {
          // console.log('el.introduction_video trending', el.introduction_video);
          const thumb = await createThumbnail({
            url: el?.introduction_video,
            timeStamp: 1000,
          });
          return {
            ...el,
            thumb,
          };
        }),
      );
    } catch (error) {
      console.error('Error generating thumbnails:', error);
    }
    // console.log('thumb data SearchAllType', updatedData);
    return updatedData;
  };
  const showDateFilter = () => {
    if (selectedTab == '2') {
      return false;
    } else if (startDate !== '' && endDate !== '') {
      return true;
    }
    return false;
  };
  const isFilterApplied = () => {
    if (showSelectedCategories()) {
      return true;
    }
    return false;
  };
  const showSelectedCategories = () => {
    if (selectedTab === '1' && selectedCourseCategries?.length > 0) {
      return true;
    } else if (selectedTab === '2' && selectedProductCategries?.length > 0) {
      return true;
    }
    return false;
  };
  const ShowSelectedFilters = () => {
    return (
      <View>
        {showSelectedCategories() ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              backgroundColor: '#ede5ca',
              marginRight: 'auto',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
              marginTop: 10,
            }}>
            <MyText
              text={'Categorie(s): '}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{}}
            />

            {selectedTab === '1'
              ? selectedCourseCategries?.map((el, index) => (
                  <View
                    key={index?.toString()}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                    <MyText
                      text={el}
                      fontFamily="regular"
                      fontSize={13}
                      textColor={Colors.THEME_BROWN}
                    />
                    <TouchableOpacity
                      onPress={() => removeFilter('cat', el)}
                      style={{
                        marginLeft: 5,
                        marginTop: 3,
                      }}>
                      <Image
                        source={require('assets/images/cancelfilter.png')}
                        style={{height: 10, width: 10}}
                      />
                    </TouchableOpacity>
                  </View>
                ))
              : selectedProductCategries?.map((el, index) => (
                  <View
                    key={index?.toString()}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 10,
                    }}>
                    <MyText
                      key={el}
                      text={el}
                      fontFamily="regular"
                      fontSize={13}
                      textColor={Colors.THEME_BROWN}
                    />
                    <TouchableOpacity
                      onPress={() => removeFilter('cat', el)}
                      style={{
                        marginLeft: 5,
                        marginTop: 3,
                      }}>
                      <Image
                        source={require('assets/images/cancelfilter.png')}
                        style={{height: 10, width: 10}}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
          </View>
        ) : null}
        {showDateFilter() ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#ede5ca',
              marginRight: 'auto',
              marginTop: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
            }}>
            <MyText
              text={'Selected Dates: '}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{}}
            />
            <MyText
              text={`${moment(startDate).format('DD-MM-YYYY')} - ${moment(
                endDate,
              ).format('DD-MM-YYYY')}`}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
            />
            <TouchableOpacity
              onPress={() => removeFilter('date', '')}
              style={{
                marginLeft: 5,
                marginTop: 3,
              }}>
              <Image
                source={require('assets/images/cancelfilter.png')}
                style={{height: 10, width: 10}}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  };
  const multiSliderValuesChange = values => {
    setMultiSliderValue(values);
  };

  const openFilterModal = () => {
    setShowFilterModal(true);
  };
  const openReviewModal = (id, type) => {
    setSelectedId(id);
    setSelectedType(type);
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
    getMyOrders(id);
  };

  const gotoStartCourse = () => {
    navigation.navigate(ScreenNames.START_COURSE);
  };
  const gotoOrderDetails = (order_id, item_id) => {
    console.log('order_id, item_id', order_id, item_id);
    navigation.navigate(ScreenNames.ORDER_DETAILS, {order_id, item_id});
  };

  const submitReview = async () => {
    if (review?.trim()?.length === 0) {
      Toast.show('Please enter review');
      return;
    }
    const postData = new FormData();
    postData.append('id', selectedId);
    postData.append('type', selectedType);
    postData.append('message', review);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.SUBMIT_REVIEW,
        postData,
      );
      console.log('submitReview resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show(resp?.data?.message, Toast.SHORT);
        setStarRating(1);
        setReview('');
      } else {
        Toast.show(resp?.data?.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in submitReview', error);
    }
    setShowLoader(false);
  };
  const gotoCourseDetails = (id, type) => {
    navigation.navigate(ScreenNames.COURSE_DETAILS, {id, type});
  };
  const gotoProductDetails = (id, type) => {
    navigation.navigate(ScreenNames.PRODUCT_DETAILS, {id, type});
  };
  const renderCourse = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => gotoCourseDetails(item?.course_id, '1')}
        style={styles.courseContainer}>
        <View style={styles.courseTopRow}>
          <MyText
            text={`Course Valid Date: ${item.course_valid_date}`}
            fontFamily="medium"
            fontSize={12}
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <MyText
              // text={item.status}
              text={item?.course_completed == '1' ? 'Completed' : 'Ongoing'}
              fontFamily="medium"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{marginLeft: 5}}
            />
          </View>
        </View>
        <View style={styles.courseSubContainer}>
          <ImageBackground
            source={{uri: item?.thumb?.path}}
            style={styles.crseImg}
            imageStyle={{borderRadius: 10}}></ImageBackground>
          <View style={{marginLeft: 11, width: width * 0.55}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <MyText
                text={'Order number: '}
                fontFamily="regular"
                fontSize={13}
                textColor={Colors.LIGHT_GREY}
                style={{}}
              />
              <MyText
                text={item.order_number}
                fontFamily="regular"
                fontSize={13}
                textColor={Colors.THEME_GOLD}
                style={{}}
              />
            </View>
            <MyText
              text={item.title}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{}}
            />
            <View style={styles.middleRow}>
              <View style={styles.ratingRow}>
                <Image source={require('assets/images/star.png')} />
                <MyText
                  text={item?.avg_rating}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.LIGHT_GREY}
                  letterSpacing={0.13}
                  style={{marginLeft: 5}}
                />
              </View>
              <View style={styles.crtrRow}>
                {/* <Image
                  source={require('assets/images/profile-circle.png')}
                  // style={styles.crtrImg}
                /> */}
                <Image
                  source={{uri: item?.content_creator_image}}
                  style={styles.createImgStyle}
                />
                <MyText
                  text={item.content_creator_name}
                  fontFamily="regular"
                  fontSize={13}
                  numberOfLines={1}
                  textColor={Colors.THEME_GOLD}
                  letterSpacing={0.13}
                  style={{marginLeft: 10}}
                />
              </View>
            </View>
            <MyText
              text={'$' + item?.price}
              fontFamily="bold"
              fontSize={14}
              textColor={Colors.THEME_GOLD}
              letterSpacing={0.14}
              style={{}}
            />
            <MyButton
              text="VIEW ORDER DETAILS"
              style={{
                width: '90%',
                height: 40,
                marginTop: 8,
                backgroundColor: Colors.THEME_BROWN,
              }}
              onPress={() => gotoOrderDetails(item?.order_id, item?.item_id)}
            />
            {/* {item.isReviewed == '0' ? (
              <MyButton
                text="WRITE YOUR REVIEW HERE"
                style={{
                  width: '90%',
                  height: 40,
                  marginTop: 8,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={() => openReviewModal(item?.course_id, '1')}
              />
            ) : null} */}
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
          text={`Course Completed Date: ${item.course_valid_date}`}
          fontFamily="medium"
          fontSize={12}
          textColor={Colors.LIGHT_GREY}
          style={{}}
        />
      </TouchableOpacity>
    );
  };
  const renderProduct = ({item}) => {
    return (
      <TouchableOpacity
        // onPress={() => gotoProductDetails(item?.order_id, '2')}
        onPress={() => gotoOrderDetails(item?.order_id, item?.item_id)}
        style={styles.courseContainer}>
        <View style={styles.courseTopRow}>
          <MyText
            text={`Order ID: ${item?.order_number}`}
            fontFamily="medium"
            fontSize={12}
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <MyText
              text={item.order_status}
              fontFamily="medium"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{marginLeft: 5}}
            />
          </View>
        </View>
        <View style={styles.courseSubContainer}>
          <ImageBackground
            source={require('assets/images/rectangle-1035.png')}
            style={styles.crseImg}></ImageBackground>
          <View style={{marginLeft: 11, width: width * 0.5}}>
            <MyText
              text={item.title}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{}}
            />
            <View style={styles.middleRow}>
              <View style={styles.ratingRow}>
                <Image source={require('assets/images/star.png')} />
                <MyText
                  text={item?.avg_rating}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.LIGHT_GREY}
                  letterSpacing={0.13}
                  style={{marginLeft: 5}}
                />
              </View>
              <View style={styles.crtrRow}>
                {/* <Image
                  source={require('assets/images/profile-circle.png')}
                  // style={styles.crtrImg}
                /> */}
                <Image
                  source={{uri: item?.content_creator_image}}
                  style={styles.createImgStyle}
                />
                <MyText
                  text={item.content_creator_name}
                  fontFamily="regular"
                  fontSize={13}
                  numberOfLines={1}
                  textColor={Colors.THEME_GOLD}
                  letterSpacing={0.13}
                  style={{marginLeft: 10}}
                />
              </View>
            </View>
            <View style={styles.bottomRow}>
              <MyText
                text={'$' + item?.price}
                fontFamily="bold"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                letterSpacing={0.14}
                style={{}}
              />
              <View style={styles.iconsRow}>
                {/* <Image source={require('assets/images/heart-selected.png')} /> */}
                <Image
                  source={require('assets/images/share.png')}
                  style={{marginLeft: 10}}
                />
              </View>
            </View>
            {/* {item.isReviewed == '0' ? (
              <MyButton
                text="WRITE YOUR REVIEW HERE"
                style={{
                  // width: '90%',
                  height: 40,
                  marginTop: 8,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={() => openReviewModal(item?.id, '2')}
              />
            ) : null} */}
          </View>
        </View>
        <Divider
          style={{borderColor: '#ECECEC', marginTop: 11, marginBottom: 5}}
        />
        <MyText
          text={item.order_date}
          fontFamily="medium"
          fontSize={12}
          textColor={Colors.LIGHT_GREY}
          style={{}}
        />
      </TouchableOpacity>
    );
  };
  const setOriginalValues = () => {
    setSelectedTab(temporarySelectedTab);
    setSelectedCourseCategries(tempSelectedCourseCategries);
    setSelectedProductCategries(TempSelectedProductCategries);
    setSelectedRatingValues(tempSelectedRatingValues);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };
  const setOriginalValues2 = () => {
    setSelectedCourseCategries(tempSelectedCourseCategries);
    setSelectedProductCategries(TempSelectedProductCategries);
    setSelectedRatingValues(tempSelectedRatingValues);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };
  const applyFilters = async (searchParam = '') => {
    setOriginalValues();
    const postData = new FormData();
    postData.append('type', temporarySelectedTab);
    let catIds = [];
    if (temporarySelectedTab === '1') {
      catIds = courseCategries
        ?.filter(el => tempSelectedCourseCategries?.includes(el?.name))
        ?.map(el => el?.id);
    } else {
      catIds = productCategries
        ?.filter(el => TempSelectedProductCategries?.includes(el?.name))
        ?.map(el => el?.id);
    }
    if (catIds?.length > 0) {
      catIds?.map(el => postData.append('category[]', el));
    }
    if (temporarySelectedTab === '1') {
      if (tempStartDate !== '' && tempEndDate !== '') {
        postData.append(
          'start_date',
          moment(tempStartDate).format('YYYY-MM-DD'),
        );
        postData.append('end_date', moment(tempEndDate).format('YYYY-MM-DD'));
      }
    }
    if (tempSelectedRatingValues?.length > 0) {
      tempSelectedRatingValues?.map(el => postData.append('rating[]', el));
    }
    const isSearchTermExists = searchParam?.toString()?.trim()?.length > 0;
    const isSearchValueExists = searchValue?.toString()?.trim()?.length > 0;
    console.log(
      'isSearchTermExists, isSearchValueExists',
      isSearchTermExists,
      isSearchValueExists,
    );
    console.log('searchTerm', searchParam);
    console.log('searchValue', searchValue);
    if (isSearchTermExists || isSearchValueExists) {
      // handling special case: while deleting last character of search, since search state would not update fast, so using searchParam instead of search state (searchValue)
      if (
        searchValue?.toString()?.trim()?.length === 1 &&
        searchParam?.toString()?.trim()?.length === 0
      ) {
        postData.append('title', searchParam?.toString()?.trim());
      } else {
        // preferring to check searchParam first, because it has the most recent search value fast. But it is not always passed, in else case using searchValue
        if (isSearchTermExists) {
          postData.append('title', searchParam?.toString()?.trim());
        } else {
          postData.append('title', searchValue?.toString()?.trim());
        }
      }
    }
    console.log('applyFilters postData', JSON.stringify(postData));
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.MY_ORDER,
        postData,
      );
      console.log('applyFilters resp', resp?.data);
      if (resp?.data?.status) {
        // tab is not changed when searching
        if (temporarySelectedTab !== selectedTab) {
          setSelectedTab(temporarySelectedTab);
        }

        setShowFilterModal(false);
        if (temporarySelectedTab === '1') {
          const updatedData = await generateThumb(resp?.data?.data);
          setCourseData(updatedData);
        } else {
          setProductData(resp?.data?.data);
        }
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in applyFilters', error);
    }
    setShowLoader(false);
  };
  const applyFilters2 = async (searchParam = '') => {
    const isDeletingLastCharacterInSearch =
      searchValue?.toString()?.trim()?.length === 1 &&
      searchParam?.toString()?.trim()?.length === 0;
    const isSearching = isDeletingLastCharacterInSearch || searchParam !== '';
    setOriginalValues2();
    const postData = new FormData();
    postData.append('type', selectedTab);
    let catIds = [];
    if (temporarySelectedTab === '1') {
      catIds = courseCategries
        ?.filter(el => tempSelectedCourseCategries?.includes(el?.name))
        ?.map(el => el?.id);
    } else {
      catIds = productCategries
        ?.filter(el => TempSelectedProductCategries?.includes(el?.name))
        ?.map(el => el?.id);
    }
    if (catIds?.length > 0) {
      catIds?.map(el => postData.append('category[]', el));
    }
    if (temporarySelectedTab === '1') {
      if (tempStartDate !== '' && tempEndDate !== '') {
        postData.append(
          'start_date',
          moment(tempStartDate).format('YYYY-MM-DD'),
        );
        postData.append('end_date', moment(tempEndDate).format('YYYY-MM-DD'));
      }
    }
    if (tempSelectedRatingValues?.length > 0) {
      tempSelectedRatingValues?.map(el => postData.append('rating[]', el));
    }
    const isSearchTermExists = searchParam?.toString()?.trim()?.length > 0;
    const isSearchValueExists = searchValue?.toString()?.trim()?.length > 0;
    console.log(
      'isSearchTermExists, isSearchValueExists',
      isSearchTermExists,
      isSearchValueExists,
    );
    console.log('searchTerm', searchParam);
    console.log('searchValue', searchValue);
    if (isSearchTermExists || isSearchValueExists) {
      // handling special case: while deleting last character of search, since search state would not update fast, so using searchParam instead of search state (searchValue)
      if (
        searchValue?.toString()?.trim()?.length === 1 &&
        searchParam?.toString()?.trim()?.length === 0
      ) {
        postData.append('title', searchParam?.toString()?.trim());
      } else {
        // preferring to check searchParam first, because it has the most recent search value fast. But it is not always passed, in else case using searchValue
        if (isSearchTermExists) {
          postData.append('title', searchParam?.toString()?.trim());
        } else {
          postData.append('title', searchValue?.toString()?.trim());
        }
      }
    }
    console.log('applyFilters postData', JSON.stringify(postData));
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.MY_ORDER,
        postData,
      );
      console.log('applyFilters resp', resp?.data);
      if (resp?.data?.status) {
        setShowFilterModal(false);
        if (selectedTab === '1') {
          const updatedData = await generateThumb(resp?.data?.data);
          setCourseData(updatedData);
        } else {
          setProductData(resp?.data?.data);
        }
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in applyFilters', error);
    }
    setShowLoader(false);
  };
  const resetFilter = async () => {
    setShowFilterModal(false);
    // emptying all filter states and calling getMyOrders
    setSearchValue('');
    setSelectedTab('1');
    setTemporarySelectedTab('1');
    setSelectedCourseCategries([]);
    setTempSelectedCourseCategries([]);
    setSelectedProductCategries([]);
    setTempSelectedProductCategries([]);
    setSelectedRatingValues([]);
    setTempSelectedRatingValues([]);
    setTempStartDate('');
    setTempEndDate('');
    setStartDate('');
    setEndDate('');
    await getMyOrders();
  };
  const removeFilter = async (filterType, item) => {
    let remainingStartDate = tempStartDate;
    let remainingEndDate = tempEndDate;
    if (filterType === 'date') {
      remainingStartDate = '';
      remainingEndDate = '';
      setTempStartDate('');
      setTempEndDate('');
      setStartDate('');
      setEndDate('');
    }
    if (selectedTab === '1') {
      if (remainingStartDate !== '' && remainingEndDate !== '') {
        postData.append('start_date', remainingStartDate);
        postData.append('end_date', remainingEndDate);
      }
    }
    let remainingSelectedCategories =
      selectedTab === '1'
        ? selectedCourseCategries
        : TempSelectedProductCategries;
    console.log('selectedCourseCategries', selectedCourseCategries, item);
    if (filterType === 'cat') {
      if (selectedTab === '1') {
        remainingSelectedCategories = selectedCourseCategries?.filter(
          el => el !== item,
        );
        setSelectedCourseCategries([...remainingSelectedCategories]);
        setTempSelectedCourseCategries([...remainingSelectedCategories]);
      } else {
        remainingSelectedCategories = TempSelectedProductCategries?.filter(
          el => el !== item,
        );
        setSelectedProductCategries([...remainingSelectedCategories]);
        setTempSelectedProductCategries([...remainingSelectedCategories]);
      }
    }
    let remainingselectedRatingValues = [...selectedRatingValues];
    if (filterType === 'rating') {
      remainingselectedRatingValues = selectedRatingValues?.filter(
        el => el !== item,
      );
      setSelectedRatingValues(remainingselectedRatingValues);
      setTempSelectedRatingValues(remainingselectedRatingValues);
    }
    selectedRatingValues;
    const postData = new FormData();
    postData.append('type', temporarySelectedTab);
    let catIds = [];
    if (temporarySelectedTab === '1') {
      catIds = courseCategries
        ?.filter(el => remainingSelectedCategories?.includes(el?.name))
        ?.map(el => el?.id);
    } else {
      catIds = productCategries
        ?.filter(el => remainingSelectedCategories?.includes(el?.name))
        ?.map(el => el?.id);
    }
    if (catIds?.length > 0) {
      catIds?.map(el => postData.append('category[]', el));
    }
    if (remainingselectedRatingValues?.length > 0) {
      remainingselectedRatingValues?.map(el => postData.append('rating[]', el));
    }
    console.log('removeFilter postData', JSON.stringify(postData));
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.MY_ORDER,
        postData,
      );
      // console.log('removeFilter resp', resp?.data);
      if (resp?.data?.status) {
        if (temporarySelectedTab !== selectedTab) {
          setSelectedTab(temporarySelectedTab);
        }
        setShowFilterModal(false);
        if (temporarySelectedTab === '1') {
          const updatedData = await generateThumb(resp?.data?.data);
          setCourseData(updatedData);
        } else {
          setProductData(resp?.data?.data);
        }
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in removeFilter', error);
    }
    setShowLoader(false);
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
          <SearchWithIcon
            value={searchValue}
            icon={<Image source={require('assets/images/filter.png')} />}
            placeholder="Search..."
            onPress={openFilterModal}
            onChangeText={e => {
              console.log('SearchWithIcon', e);
              setSearchValue(e);
              applyFilters2(e);
            }}
            style={{marginTop: 10}}
            showDot={isFilterApplied}
          />
          <ShowSelectedFilters />
          {selectedTab === '1' ? (
            courseData?.length > 0 ? (
              <FlatList
                data={courseData}
                style={{marginTop: 28}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCourse}
              />
            ) : (
              <View style={{alignItems: 'center', marginTop: 50}}>
                <Image source={require('assets/images/no-data.png')} />
                <MyText
                  text={'No Courses found'}
                  fontFamily="medium"
                  fontSize={40}
                  textAlign="center"
                  textColor={'black'}
                />
              </View>
            )
          ) : productData?.length > 0 ? (
            <FlatList
              data={productData}
              style={{marginTop: 28}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderProduct}
            />
          ) : (
            <View style={{alignItems: 'center', marginTop: 50}}>
              <Image source={require('assets/images/no-data.png')} />
              <MyText
                text={'No Products found'}
                fontFamily="medium"
                fontSize={40}
                textAlign="center"
                textColor={'black'}
              />
            </View>
          )}
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
        <OrdersFilter
          visible={showFilterModal}
          setVisibility={setShowFilterModal}
          onClearFilter={onClearFilter}
          onApplyFilter={onApplyFilter}
          courseCategries={courseCategries}
          productCategries={productCategries}
          tempSelectedCourseCategries={tempSelectedCourseCategries}
          setTempSelectedCourseCategries={setTempSelectedCourseCategries}
          TempSelectedProductCategries={TempSelectedProductCategries}
          setTempSelectedProductCategries={setTempSelectedProductCategries}
          tabs={tabs}
          temporarySelectedTab={temporarySelectedTab}
          setTemporarySelectedTab={setTemporarySelectedTab}
          tempStartDate={tempStartDate}
          setTempStartDate={setTempStartDate}
          openTempStartDate={openTempStartDate}
          setOpenTempStartDate={setOpenTempStartDate}
          tempEndDate={tempEndDate}
          setTempEndDate={setTempEndDate}
          openTempEndDate={openTempEndDate}
          setOpenTempEndDate={setOpenTempEndDate}
          applyFilters={applyFilters}
          resetFilter={resetFilter}
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
        <DatePicker
          modal
          mode="date"
          // mode="time"
          open={openTempStartDate}
          date={tempStartDate || new Date()}
          onConfirm={time => {
            setOpenTempStartDate(false);
            setTempStartDate(time);
          }}
          onCancel={() => {
            setOpenTempStartDate(false);
          }}
          // minimumDate={new Date()}
        />
        <DatePicker
          modal
          mode="date"
          // mode="time"
          open={openTempEndDate}
          date={tempEndDate || new Date()}
          onConfirm={time => {
            setOpenTempEndDate(false);
            setTempEndDate(time);
          }}
          onCancel={() => {
            setOpenTempEndDate(false);
          }}
          // minimumDate={new Date()}
        />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(MyOrders);
