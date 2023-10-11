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
  const [priceFilterValues, setPriceFilterValues] = useState([
    {
      id: '1',
      name: 'High to Low',
    },
    {
      id: '2',
      name: 'Low to High',
    },
  ]);
  const [tempSelectedPriceFilter, setTempSelectedPriceFilter] = useState('');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState('');
  const [selectedRatingValues, setSelectedRatingValues] = useState([]);
  const [tempSelectedRatingValues, setTempSelectedRatingValues] = useState([]);

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
  const isFilterApplied = () => {
    if (showSelectedCategories()) {
      return true;
    } else if (selectedPriceFilter !== '') {
      return true;
    } else if (selectedRatingValues?.length > 0) {
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
        {selectedPriceFilter !== '' ? (
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
              text={'Price: '}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{}}
            />
            <MyText
              text={
                priceFilterValues?.find(el => el.id === selectedPriceFilter)
                  ?.name
              }
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
            />
            <TouchableOpacity
              onPress={() => removeFilter('price', selectedPriceFilter)}
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
        {selectedRatingValues?.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              backgroundColor: '#ede5ca',
              marginRight: 'auto',
              marginTop: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
            }}>
            <MyText
              text={'Rating: '}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{}}
            />
            {selectedRatingValues?.map((el, index) => (
              <View
                key={index?.toString()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 10,
                }}>
                <MyText
                  key={el}
                  text={`${el} and more`}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.THEME_BROWN}
                />
                <TouchableOpacity
                  onPress={() => removeFilter('rating', el)}
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
              text={item?.course_completed == '1' ? 'Completed' : 'Pending'}
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
            <TouchableOpacity
              onPress={gotoStartCourse}
              style={styles.courseButton}>
              <Image source={require('assets/images/play.png')} />
              <MyText
                text={
                  item.order_status === 'Pending'
                    ? 'Resume'
                    : 'Start over again'
                }
                fontFamily="medium"
                fontSize={13}
                textColor={Colors.THEME_GOLD}
                letterSpacing={0.13}
                style={{marginLeft: 5}}
              />
            </TouchableOpacity>
            {item.isReviewed == '0' ? (
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
        onPress={() => gotoProductDetails(item?.order_id, '2')}
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
            {item.isReviewed == '0' ? (
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
            ) : null}
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
              data={courseData}
              style={{marginTop: 28}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderCourse}
            />
          ) : (
            <FlatList
              data={productData}
              style={{marginTop: 28}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderProduct}
            />
          )}
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
        <OrdersFilter
          visible={showFilterModal}
          setVisibility={setShowFilterModal}
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
