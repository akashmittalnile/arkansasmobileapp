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
  RefreshControl,
} from 'react-native';
//import : custom components
import MyHeader from 'components/MyHeader/MyHeader';
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
//import : third parties
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
// import Toast from 'react-native-toast-message';
//import : global
import {Colors, Constant, MyIcon, ScreenNames, Service} from 'global/Index';
//import : styles
import {styles} from './HomeStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
// import {WebView} from 'react-native-webview';
import MyButton from '../../../components/MyButton/MyButton';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';
import ViewAll from '../../../components/ViewAll/ViewAll';
import {createThumbnail} from 'react-native-create-thumbnail';
import {
  setUserNotifications,
  setCartCount,
} from 'src/reduxToolkit/reducer/user';
import SearchWithIconDummy from '../../../components/SearchWithIconDummy/SearchWithIconDummy';
import VideoModal from '../../../components/VideoModal/VideoModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [showLoader2, setShowLoader2] = useState(false);
  const [showTrendingLoader, setShowTrendingLoader] = useState(false);
  const [showSpecialLoader, setShowSpecialLoader] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [originalHomeData, setOriginalHomeData] = useState({});
  const [homeData, setHomeData] = useState({});
  const [selectedTag, setSelectedTag] = useState('1');
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [showModal, setShowModal] = useState({isVisible: false, data: null});
  const [refreshing, setRefreshing] = useState(false);
  const [scrolling, setscrolling] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('userToken', userToken);
      getHomeData();
      getCartCount();
    });
    return unsubscribe;
  }, [navigation]);
  // console.log('useefect', originalHomeData?.trending_course);
  const getHomeData = async () => {
    !showLoader && setShowLoader(true);
    try {
      const resp = await Service.getApiWithToken(userToken, Service.HOME);
      // console.log('getHomeData resp', JSON.stringify(resp?.data?.data));
      // console.log('getHomeData trending_course?.length', JSON.stringify(resp?.data?.data?.trending_course?.length));
      if (resp?.data?.status) {
        setOriginalHomeData({...resp?.data?.data});
        const data = {...resp?.data?.data};
        // get first 2 trending and special courses
        if (data?.trending_course && Array.isArray(data?.trending_course)) {
          data.trending_course = resp?.data?.data?.trending_course?.slice(0, 2);
        }
        if (data?.special_course && Array.isArray(data?.special_course)) {
          data.special_course = resp?.data?.data?.special_course?.slice(0, 2);
        }
        console.log('remaining data', data);
        const dataWithThumb = await generateThumb(data);
        setHomeData(dataWithThumb);
      } else {
        Toast.show({text1: resp.data.message});
      }
    } catch (error) {
      console.log('error in getHomeData', error);
    }
    setShowLoader(false);
  };
  const getCartCount = async () => {
    setShowLoader2(true);
    try {
      const resp = await Service.getApiWithToken(userToken, Service.CART_COUNT);
      console.log('getCartCount resp', resp?.data);
      if (resp?.data?.status) {
        dispatch(setCartCount(resp?.data?.data));
      } else {
        Toast.show({text1: resp.data.message});
      }
    } catch (error) {
      console.log('error in getCartCount', error);
    }
    setShowLoader2(false);
  };
  const checkcon = () => {
    getHomeData();
    getCartCount();
  };
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    checkcon();
    wait(2000).then(() => {
      setRefreshing(false);
    });
  }, []);
  const onLike = async (type, id, status) => {
    setShowLoader(true);
    const formdata = new FormData();
    formdata.append('type', type);
    formdata.append('id', id);
    formdata.append('status', status == '1' ? '0' : '1');
    console.log('onLike formdata', formdata);
    const endPoint =
      status == '1' ? Service.UNLIKE_OBJECT_TYPE : Service.LIKE_OBJECT_TYPE;
    console.log('onLike endPoint', endPoint);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        endPoint,
        formdata,
      );
      console.log('onLike resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show({text1: resp.data.message});
        getHomeData();
      } else {
        Toast.show({text1: resp.data.message});
      }
    } catch (error) {
      console.log('error in onLike', error);
    }
    showLoader && setShowLoader(false);
  };
  const generateThumb = async data => {
    // console.log('generateThumb');
    let trending_course_data = [...data?.trending_course];
    // let suggested_course_data = [...data?.suggested_course];
    let special_course_data = [...data?.special_course];
    try {
      trending_course_data = await Promise.all(
        data?.trending_course?.map?.(async el => {
          // console.log('el.introduction_video trending', el.introduction_video);
          const thumb = await createThumbnail({
            url: el.introduction_video,
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
    try {
      special_course_data = await Promise.all(
        data?.special_course?.map?.(async el => {
          // console.log('el.introduction_video suggested', el.introduction_video);
          const thumb = await createThumbnail({
            url: el.introduction_video,
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
    // try {
    //   suggested_course_data = await Promise.all(
    //     data?.suggested_course?.map?.(async el => {
    //       // console.log('el.introduction_video suggested', el.introduction_video);
    //       const thumb = await createThumbnail({
    //         url: el.introduction_video,
    //         timeStamp: 1000,
    //       });
    //       return {
    //         ...el,
    //         thumb,
    //       };
    //     }),
    //   );
    // } catch (error) {
    //   console.error('Error generating thumbnails:', error);
    // }

    // console.log('trending_course_data', trending_course_data);
    // console.log('suggested_course_data', suggested_course_data);
    // data.suggested_course = suggested_course_data;
    data.trending_course = trending_course_data;
    data.special_course = special_course_data;
    // console.log('thumb data', data);
    // const updatedData = {...data, suggested_course: suggested_course_data, trending_course: trending_course_data}
    return data;
  };
  const generateTrendingThumb = async data => {
    // console.log('generateThumb');
    let trending_course_data = [...data];
    try {
      trending_course_data = await Promise.all(
        data?.map?.(async el => {
          // console.log('el.introduction_video trending', el.introduction_video);
          const thumb = await createThumbnail({
            url: el.introduction_video,
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
    console.log('thumb trending data', trending_course_data);
    // const updatedData = {...data, suggested_course: suggested_course_data, trending_course: trending_course_data}
    return trending_course_data;
  };
  const generateSpecialThumb = async data => {
    // console.log('generateThumb');
    let special_course_data = [...data];
    try {
      special_course_data = await Promise.all(
        data?.map?.(async el => {
          // console.log('el.introduction_video trending', el.introduction_video);
          const thumb = await createThumbnail({
            url: el.introduction_video,
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
    console.log('thumb trending data', special_course_data);
    return special_course_data;
  };
  const fetchMoreTrendingCourses = async () => {
    console.log('original trending', originalHomeData?.trending_course?.length);
    if (
      homeData?.trending_course?.length ===
      originalHomeData?.trending_course?.length
    ) {
      return;
    }
    setShowTrendingLoader(true);
    try {
      const data = originalHomeData?.trending_course?.slice(
        homeData?.trending_course?.length,
        homeData?.trending_course?.length + 2,
      );
      console.log('data', data);
      // console.log(
      //   'fetchMoreTrendingCourses',
      //   JSON.stringify(originalHomeData?.trending_course),
      // );
      const updatedData = await generateTrendingThumb(data);
      // console.log('here3', updatedData);
      const localHomeData = deepCopy(homeData);
      // console.log('here3', localHomeData);
      localHomeData.trending_course = [
        ...homeData?.trending_course,
        ...updatedData,
      ];
      // console.log('here4', JSON.stringify(localHomeData));
      setHomeData(deepCopy(localHomeData));
    } catch (error) {
      console.log('cannot fetchMoreTrendingCourses');
    }
    setShowTrendingLoader(false);
  };
  const fetchMoreSpecialCourses = async () => {
    console.log('original trending', originalHomeData?.special_course?.length);
    if (
      homeData?.special_course?.length ===
      originalHomeData?.special_course?.length
    ) {
      return;
    }
    setShowSpecialLoader(true);
    try {
      const data = originalHomeData?.special_course?.slice(
        homeData?.special_course?.length,
        homeData?.special_course?.length + 2,
      );
      console.log('data', data);
      // console.log(
      //   'fetchMoreTrendingCourses',
      //   JSON.stringify(originalHomeData?.special_course),
      // );
      const updatedData = await generateSpecialThumb(data);
      // console.log('here3', updatedData);
      const localHomeData = deepCopy(homeData);
      // console.log('here3', localHomeData);
      localHomeData.special_course = [
        ...homeData?.special_course,
        ...updatedData,
      ];
      // console.log('here4', JSON.stringify(localHomeData));
      setHomeData(deepCopy(localHomeData));
    } catch (error) {
      console.log('cannot fetchMoreTrendingCourses');
    }
    setShowSpecialLoader(false);
  };
  const renderTrendingFooter = () => {
    console.log('renderTrendingFooter');
    return showTrendingLoader ? (
      <View style={{flex: 1, justifyContent:'center'}} >
        <ActivityIndicator size="large" color={Colors.THEME_GOLD} />
      </View>
    ) : null;
  };
  const renderSpecialFooter = () => {
    console.log('renderTrendingFooter');
    return showSpecialLoader ? (
      <View style={{flex: 1, justifyContent:'center'}} >
        <ActivityIndicator size="large" color={Colors.THEME_GOLD} />
      </View>
    ) : null;
  };
  const toggleModal = state => {
    setShowModal({
      isVisible: state.isVisible,
      data: state.data,
    });
  };
  const gotoSearchAllType = () => {
    navigation.navigate(ScreenNames.SEACRCH_ALL_TYPE);
  };
  const gotoTrendingCourses = () => {
    navigation.navigate(ScreenNames.TRENDING_COURSES);
  };
  const gotoSuggestedCourses = () => {
    navigation.navigate(ScreenNames.SUGGESTED_COURSES);
  };
  const gotoSuperAdminCourses = () => {
    navigation.navigate(ScreenNames.SUPER_ADMIN_COURSES);
  };
  const gotoTopCategory = typeParam => {
    navigation.navigate(ScreenNames.TOP_CATEGORY, {typeParam});
  };
  const gotoCourseDetails = (id, type) => {
    navigation.navigate(ScreenNames.COURSE_DETAILS, {id, type});
  };
  const gotoSearchCourseByCategory = id => {
    navigation.navigate(ScreenNames.SEARCH_COURSE_BY_CATEGORY, {id});
  };
  const gotoSearchCourseByTag = id => {
    navigation.navigate(ScreenNames.SEARCH_COURSE_BY_TAG, {id});
  };
  const gotoSearchProductByTag = id => {
    navigation.navigate(ScreenNames.SEARCH_PRODUCT_BY_TAG, {id});
  };
  const searchByTag = (id, type) => {
    if (type == '1') {
      gotoSearchCourseByTag(id);
    } else if (type == '2') {
      gotoSearchProductByTag(id);
    }
  };
  const gotoSearchProductByCategory = id => {
    navigation.navigate(ScreenNames.SEARCH_PRODUCT_BY_CATEGORY, {id});
  };
  const gotoProductDetails = (id, type) => {
    navigation.navigate(ScreenNames.PRODUCT_DETAILS, {id, type});
  };
  const gotoAllProducts = () => {
    navigation.navigate(ScreenNames.ALL_PRODUCTS);
  };
  const gotoSuggestedProducts = () => {
    navigation.navigate(ScreenNames.SUGGESTED_PRODUCTS);
  };

  const changeSelectedTag = id => {
    setSelectedTag(id);
  };
  const gotoCart = () => navigation.navigate(ScreenNames.CART);
  const addToCart = async (object_id, object_type, cart_value) => {
    const postData = new FormData();
    postData.append('object_id', object_id);
    postData.append('object_type', object_type);
    postData.append('cart_value', cart_value);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.ADD_TO_CART,
        postData,
      );
      console.log('addToCart resp', resp?.data);
      if (resp?.data?.status) {
        dispatch(setCartCount(resp?.data?.cart_count));
        await AsyncStorage.setItem(
          'cart_count',
          JSON.stringify(resp?.data?.cart_count),
        );
        Toast.show({text1: resp?.data?.message});
        gotoCart();
      } else {
        Toast.show({text1: resp?.data?.message});
      }
    } catch (error) {
      console.log('error in addToCart', error);
    }
    setShowLoader(false);
  };
  const renderTags = ({item}) => {
    return (
      <TouchableOpacity
        // onPress={() => changeSelectedTag(item.id)}
        onPress={() => searchByTag(item.id, item.type)}
        style={[
          styles.courseTypeContainer,
          selectedTag === item.id
            ? {backgroundColor: Colors.THEME_BROWN}
            : null,
        ]}>
        <MyText
          text={item.name}
          fontFamily="regular"
          fontSize={14}
          textColor={selectedTag === item.id ? Colors.THEME_GOLD : 'black'}
        />
      </TouchableOpacity>
    );
  };
  // const renderCourse = ({item}) => {
  //   return (
  //     <TouchableOpacity
  //       onPress={gotoProductDetails}
  //       style={styles.courseContainer}>
  //       <View style={styles.topRow}>
  //         <View style={styles.topLeftRow}>
  //           <Image source={{uri: item.creatorImg}} style={styles.crtrImg} />
  //           <MyText
  //             text={item.creatorName}
  //             fontFamily="regular"
  //             fontSize={13}
  //             textColor={Colors.THEME_GOLD}
  //             letterSpacing={0.13}
  //             style={{marginLeft: 10}}
  //           />
  //         </View>
  //         <View style={styles.topRightRow}>
  //           <Image source={require('assets/images/heart.png')} />
  //           <Image
  //             source={require('assets/images/share.png')}
  //             style={{marginLeft: 10}}
  //           />
  //         </View>
  //       </View>
  //       <ImageBackground source={item.courseImg} style={styles.crseImg}>
  //         <TouchableOpacity>
  //           <Image source={require('assets/images/play-icon.png')} />
  //         </TouchableOpacity>
  //       </ImageBackground>
  //       <View style={styles.bottomRow}>
  //         <View style={{width: '60%'}}>
  //           <MyText
  //             text={item.courseName}
  //             fontFamily="regular"
  //             fontSize={13}
  //             textColor={Colors.LIGHT_GREY}
  //             style={{}}
  //           />
  //           <View style={styles.courseNameView}>
  //             <MyText
  //               text={'Course Fee:'}
  //               fontFamily="regular"
  //               fontSize={13}
  //               textColor={Colors.LIGHT_GREY}
  //               letterSpacing={0.13}
  //               style={{}}
  //             />
  //             <MyText
  //               text={'$' + item.courseFee}
  //               fontFamily="bold"
  //               fontSize={14}
  //               textColor={Colors.THEME_GOLD}
  //               letterSpacing={0.14}
  //               style={{}}
  //             />
  //           </View>
  //         </View>
  //         <View style={styles.bottomRight}>
  //           <Image source={require('assets/images/star.png')} />
  //           <MyText
  //             text={item.courseRating}
  //             fontFamily="regular"
  //             fontSize={13}
  //             textColor={Colors.LIGHT_GREY}
  //             letterSpacing={0.13}
  //             style={{marginLeft: 10}}
  //           />
  //         </View>
  //       </View>
  //       {/* <MyText
  //         text={item.name}
  //         fontFamily="regular"
  //         fontSize={14}
  //         textColor={'black'}
  //       /> */}
  //     </TouchableOpacity>
  //   );
  // };
  const renderCourse = ({item}) => {
    // console.log('item?.thumb?.path', item?.thumb?.path);
    return (
      <TouchableOpacity
        onPress={() => gotoCourseDetails(item?.id, '1')}
        style={styles.courseContainer}>
        <View style={styles.topRow}>
          <View style={styles.topLeftRow}>
            {item?.content_creator_image ? (
              <Image
                source={{uri: item?.content_creator_image}}
                style={styles.crtrImg}
              />
            ) : null}
            <MyText
              text={item.content_creator_name}
              fontFamily="regular"
              numberOfLines={1}
              fontSize={13}
              textColor={Colors.THEME_GOLD}
              letterSpacing={0.13}
              style={{marginLeft: 10, width: '60%'}}
            />
          </View>
          <View style={styles.topRightRow}>
            <TouchableOpacity
              onPress={() => {
                onLike('1', item.id, item?.isWishlist);
              }}>
              <Image
                source={
                  item?.isWishlist
                    ? require('assets/images/heart-selected.png')
                    : require('assets/images/heart.png')
                }
              />
            </TouchableOpacity>
            <Image
              source={require('assets/images/share.png')}
              style={{marginLeft: 10}}
            />
          </View>
        </View>
        {item?.thumb?.path ? (
          <ImageBackground
            source={{uri: item?.thumb?.path}}
            style={styles.crseImg}>
            <TouchableOpacity
              onPress={() => {
                setShowModal({
                  isVisible: true,
                  data: item,
                });
              }}>
              <Image source={require('assets/images/play-icon.png')} />
            </TouchableOpacity>
          </ImageBackground>
        ) : null}
        <View style={styles.bottomRow}>
          <View style={{width: '60%'}}>
            <MyText
              text={item.title}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{}}
            />
            <View style={styles.courseNameView}>
              <MyText
                text={'Course Fee: '}
                fontFamily="regular"
                fontSize={13}
                textColor={Colors.LIGHT_GREY}
                letterSpacing={0.13}
                style={{}}
              />
              <MyText
                text={'$' + item.course_fee}
                fontFamily="bold"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                letterSpacing={0.14}
                style={{}}
              />
            </View>
          </View>
          <View style={styles.bottomRight}>
            <Image source={require('assets/images/star.png')} />
            <MyText
              text={item?.avg_rating}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              letterSpacing={0.13}
              style={{marginLeft: 10}}
            />
          </View>
        </View>
        {/* <MyText
          text={item.name}
          fontFamily="regular"
          fontSize={14}
          textColor={'black'}
        /> */}
      </TouchableOpacity>
    );
  };
  const renderProduct = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => gotoProductDetails(item?.id, '2')}
        style={styles.productContainer}>
        <View>
          {item.Product_image[0] ? (
            <Image
              source={{uri: item.Product_image[0]}}
              style={{width: (width - 40) * 0.42, height: 136}}
            />
          ) : null}
          <TouchableOpacity
            onPress={() => {
              onLike('2', item.id, item?.isWishlist);
            }}
            style={styles.heartIcon}>
            <Image
              source={
                item?.isWishlist
                  ? require('assets/images/heart-selected.png')
                  : require('assets/images/heart-yellow-outline.png')
              }
            />
          </TouchableOpacity>
          <View style={styles.starView}>
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
        </View>
        <View style={styles.bottomView}>
          <MyText
            text={item.title}
            fontFamily="regular"
            fontSize={13}
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
          <MyText
            text={'$' + item.price}
            fontFamily="bold"
            fontSize={14}
            textColor={Colors.THEME_GOLD}
            letterSpacing={0.14}
            style={{}}
          />
          <View style={styles.productButtonsRow}>
            <MyButton
              text="Buy Now"
              style={{
                width: '70%',
                height: 30,
                backgroundColor: Colors.THEME_BROWN,
              }}
              onPress={() => {
                addToCart(item.id, '2', item.price);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                addToCart(item.id, '2', item.price);
              }}
              style={styles.prodCartView}>
              <Image
                source={require('assets/images/shopping-bag.png')}
                style={{height: 18, width: 18}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  const renderCourseCategory = ({item}) => {
    // console.log('renderCategory', item);
    return (
      <TouchableOpacity
        onPress={() => gotoSearchCourseByCategory(item?.id)}
        style={styles.categoryContainer}>
        {item.category_image ? (
          <Image source={{uri: item.category_image}} style={styles.catImg} />
        ) : null}
        <MyText
          text={item.category_name}
          fontFamily="regular"
          fontSize={13}
          textAlign="center"
          textColor={Colors.LIGHT_GREY}
          style={{marginTop: 5}}
        />
      </TouchableOpacity>
    );
  };
  const renderProductCategory = ({item}) => {
    // console.log('renderCategory', item);
    return (
      <TouchableOpacity
        onPress={() => gotoSearchProductByCategory(item?.id)}
        style={styles.categoryContainer}>
        {item.category_image ? (
          <Image source={{uri: item.category_image}} style={styles.catImg} />
        ) : null}
        <MyText
          text={item.category_name}
          fontFamily="regular"
          fontSize={13}
          textAlign="center"
          textColor={Colors.LIGHT_GREY}
          style={{marginTop: 5}}
        />
      </TouchableOpacity>
    );
  };
  const handleScroll = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset === 0) {
      // Your code to handle reaching the top of the scroll view
      console.log('Reached the top');
      setscrolling(false);
    } else {
      setscrolling(true);
    }
  };

  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader
          Title="Home"
          scrolling={scrolling}
          style={scrolling ? {zIndex: 99} : null}
        />
        {/* <MyHeader Title="Home" isBackButton /> */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          // onScrollBeginDrag={() => {
          //   setscrolling(true);
          // }}
          // onMomentumScrollEnd={() => {
          //   setscrolling(false);
          // }}
          onScroll={handleScroll}
          style={styles.mainView}>
          {!scrolling ? (
            <SearchWithIconDummy
              icon={
                <Image source={require('assets/images/yellow-seach.png')} />
              }
              placeholder="Search by Course, Creator or Product name"
              onPress={gotoSearchAllType}
            />
          ) : null}
          <FlatList
            data={homeData?.all_tags || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginTop: !scrolling ? 11 : 60}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderTags}
          />
          {homeData?.trending_course?.length > 0 ? (
            <View>
              <ViewAll
                text="Trending Courses"
                onPress={gotoTrendingCourses}
                style={{marginTop: 25}}
              />
              <FlatList
                data={homeData?.trending_course || []}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 15}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCourse}
                onEndReached={fetchMoreTrendingCourses}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderTrendingFooter}
              />
            </View>
          ) : (
            <MyText
              text={`No Trending Courses found`}
              fontFamily="medium"
              fontSize={18}
              textColor={'#455A64'}
              style={{textAlign: 'center', marginTop: 20}}
            />
          )}
          {homeData?.course_category?.length > 0 ? (
            <View>
              <ViewAll
                text="Browse Courses by Categories"
                onPress={() => gotoTopCategory('1')}
                style={{marginTop: 21}}
              />
              <FlatList
                data={homeData?.course_category || []}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 15}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCourseCategory}
              />
            </View>
          ) : (
            <MyText
              text={`No Categories found`}
              fontFamily="medium"
              fontSize={18}
              textColor={'#455A64'}
              style={{textAlign: 'center', marginTop: 20}}
            />
          )}
          {homeData?.special_course?.length > 0 ? (
            <View>
              <ViewAll
                text="Arkansas Courses"
                onPress={gotoSuperAdminCourses}
                // onPress={gotoSuggestedProducts}
                style={{marginTop: 25}}
              />
              <FlatList
                data={homeData?.special_course}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 15}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCourse}
                onEndReached={fetchMoreSpecialCourses}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderSpecialFooter}
              />
            </View>
          ) : (
            <MyText
              text={`No Arkansas Courses found`}
              fontFamily="medium"
              fontSize={18}
              textColor={'#455A64'}
              style={{textAlign: 'center', marginTop: 20}}
            />
          )}
          {showModal.isVisible ? (
            <VideoModal
              isVisible={showModal.isVisible}
              toggleModal={toggleModal}
              videoDetail={{
                ...showModal?.data,
                url: showModal?.data?.introduction_video,
              }}
              // {...props}
            />
          ) : null}
          {/* {homeData?.suggested_course?.length > 0 ? (
            <View>
              <ViewAll
                text="Suggested Courses"
                onPress={gotoSuggestedCourses}
                // onPress={gotoSuggestedProducts}
                style={{marginTop: 25}}
              />
              <FlatList
                data={homeData?.suggested_course}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 15}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCourse}
              />
            </View>
          ) : (
            <MyText
              text={`No Suggested Courses found`}
              fontFamily="medium"
              fontSize={18}
              textColor={'#455A64'}
              style={{textAlign: 'center', marginTop: 20}}
            />
          )} */}
          {homeData?.all_product?.length > 0 ? (
            <View>
              <ViewAll
                text="All Products"
                onPress={gotoAllProducts}
                // onPress={gotoSuggestedProducts}
                style={{marginTop: 25}}
              />
              <FlatList
                data={homeData?.all_product || []}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 15}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderProduct}
              />
            </View>
          ) : (
            <MyText
              text={`No All Products found`}
              fontFamily="medium"
              fontSize={18}
              textColor={'#455A64'}
              style={{textAlign: 'center', marginTop: 20}}
            />
          )}
          {homeData?.product_category?.length > 0 ? (
            <View>
              <ViewAll
                text="Browse Products by Categories"
                onPress={() => gotoTopCategory('2')}
                style={{marginTop: 21}}
              />
              <FlatList
                data={homeData?.product_category || []}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 15}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderProductCategory}
              />
            </View>
          ) : (
            <MyText
              text={`No Categories found`}
              fontFamily="medium"
              fontSize={18}
              textColor={'#455A64'}
              style={{textAlign: 'center', marginTop: 20}}
            />
          )}
          {homeData?.suggested_product?.length > 0 ? (
            <View>
              <ViewAll
                text="Suggested Products"
                // onPress={gotoSuggestedCourses}
                onPress={gotoSuggestedProducts}
                style={{marginTop: 25}}
              />
              <FlatList
                data={homeData?.suggested_product}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 15}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderProduct}
              />
            </View>
          ) : (
            <MyText
              text={`No Suggested Products found`}
              fontFamily="medium"
              fontSize={18}
              textColor={'#455A64'}
              style={{textAlign: 'center', marginTop: 20}}
            />
          )}
        </ScrollView>
        <CustomLoader showLoader={showLoader || showLoader2} />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(Home);

function deepCopy(obj, copies = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj; // Return non-objects as is
  }

  // Check if the object has already been copied
  if (copies.has(obj)) {
    return copies.get(obj);
  }

  // Create a new object of the same type as obj
  const copy = Array.isArray(obj) ? [] : {};

  // Add this object to the copies map
  copies.set(obj, copy);

  // Recursively deep copy all properties
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = deepCopy(obj[key], copies);
    }
  }

  return copy;
}

// Usage
const originalObject = {a: 1, b: {c: 2}};
const copiedObject = deepCopy(originalObject);
