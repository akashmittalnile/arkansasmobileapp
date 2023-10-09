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

const courseTypes = [
  {name: 'All', id: '1'},
  {name: 'Permanent Tatoo', id: '2'},
  {name: 'Standard Tatoo Program', id: '3'},
  {name: 'Technical Line Tatoo Program', id: '4'},
  {name: 'Piercing Scholl', id: '5'},
];
// const trendingCourses = [
//   {
//     id: '1',
//     creatorName: `Nikhil Sam`,
//     creatorImg: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`,
//     courseImg: require('assets/images/rectangle-1035.png'),
//     courseName: 'Tattoo Cover-Ups & Transformations',
//     courseRating: '4.7',
//     courseFee: '399.00',
//   },
//   {
//     id: '2',
//     creatorName: `Nikhil Sam`,
//     creatorImg: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`,
//     courseImg: require('assets/images/rectangle-1035.png'),
//     courseName: 'Tattoo Cover-Ups & Transformations',
//     courseRating: '4.7',
//     courseFee: '399.00',
//   },
//   {
//     id: '3',
//     creatorName: `Nikhil Sam`,
//     creatorImg: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`,
//     courseImg: require('assets/images/rectangle-1035.png'),
//     courseName: 'Tattoo Cover-Ups & Transformations',
//     courseRating: '4.7',
//     courseFee: '399.00',
//   },
// ];
// const topCategories = [
//   {
//     id: '1',
//     name: 'Permanent Lips Training',
//     img: require('assets/images/permanent-lips-training.png'),
//   },
//   {
//     id: '2',
//     name: 'Permanent Powder',
//     img: require('assets/images/permanent-powder.png'),
//   },
//   {
//     id: '3',
//     name: 'Permanent Eyeliner Training',
//     img: require('assets/images/permanent-eyeliner-training.png'),
//   },
// ];
const suggestedCourses = [
  {
    id: '1',
    creatorName: `Nikhil Sam`,
    creatorImg: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`,
    courseImg: require('assets/images/rectangle-1035.png'),
    courseName: 'Tattoo Cover-Ups & Transformations',
    courseRating: '4.7',
    courseFee: '399.00',
  },
  {
    id: '2',
    creatorName: `Nikhil Sam`,
    creatorImg: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`,
    courseImg: require('assets/images/rectangle-1035.png'),
    courseName: 'Tattoo Cover-Ups & Transformations',
    courseRating: '4.7',
    courseFee: '399.00',
  },
  {
    id: '3',
    creatorName: `Nikhil Sam`,
    creatorImg: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`,
    courseImg: require('assets/images/rectangle-1035.png'),
    courseName: 'Tattoo Cover-Ups & Transformations',
    courseRating: '4.7',
    courseFee: '399.00',
  },
];
const allProducts = [
  {
    id: '1',
    name: `O'Reilly's tattoo machine Motor`,
    rating: 4.7,
    price: '399',
    img: require('assets/images/prod-img-1.png'),
  },
  {
    id: '2',
    name: `O'Reilly's tattoo machine Motor`,
    rating: 4.7,
    price: '399',
    img: require('assets/images/prod-img-1.png'),
  },
  {
    id: '3',
    name: `O'Reilly's tattoo machine Motor`,
    rating: 4.7,
    price: '399',
    img: require('assets/images/prod-img-1.png'),
  },
  {
    id: '4',
    name: `O'Reilly's tattoo machine Motor`,
    rating: 4.7,
    price: '399',
    img: require('assets/images/prod-img-1.png'),
  },
];
const Home = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [showLoader2, setShowLoader2] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [homeData, setHomeData] = useState({});
  const [selectedTag, setSelectedTag] = useState('1');
  const [trendingCourses, setTrendingCourses] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('userToken', userToken);
      getHomeData();
      getCartCount();
    });
    return unsubscribe;
  }, [navigation]);
  const getHomeData = async () => {
    setShowLoader(true);
    try {
      const resp = await Service.getApiWithToken(userToken, Service.HOME);
      console.log('getHomeData resp', JSON.stringify(resp?.data));
      if (resp?.data?.status) {
        const dataWithThumb = await generateThumb(resp?.data?.data);
        setHomeData(dataWithThumb);
        // setHomeData(resp?.data?.data);
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
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
      console.log('getCartCount resp', resp);
      // if (resp?.data?.status) {
      //   dispatch(setCartCount(resp?.data?.data))
      // } else {
      //   Toast.show(resp.data.message, Toast.SHORT);
      // }
    } catch (error) {
      console.log('error in getCartCount', error);
    }
    setShowLoader2(false);
  };

  const generateThumb = async data => {
    console.log('generateThumb');
    let trending_course_data = [...data?.trending_course];
    let suggested_course_data = [...data?.suggested_course];
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
      suggested_course_data = await Promise.all(
        data?.suggested_course?.map?.(async el => {
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

    // console.log('trending_course_data', trending_course_data);
    // console.log('suggested_course_data', suggested_course_data);
    data.suggested_course = suggested_course_data;
    data.trending_course = trending_course_data;
    console.log('thumb data', data);
    // const updatedData = {...data, suggested_course: suggested_course_data, trending_course: trending_course_data}
    return data;
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
  const gotoTopCategory = () => {
    navigation.navigate(ScreenNames.TOP_CATEGORY);
  };
  const gotoCourseDetails = (id, type) => {
    navigation.navigate(ScreenNames.COURSE_DETAILS, {id, type});
  };
  const gotoSearchCourseByCategory = id => {
    navigation.navigate(ScreenNames.SEARCH_COURSE_BY_CATEGORY, {id});
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
        Toast.show(resp?.data?.message, Toast.SHORT);
      } else {
        Toast.show(resp?.data?.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in addToCart', error);
    }
    setShowLoader(false);
  };
  const renderTags = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => changeSelectedTag(item.id)}
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
              style={{marginLeft: 10, width: '80%'}}
            />
          </View>
          <View style={styles.topRightRow}>
            <Image source={require('assets/images/heart.png')} />
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
            <TouchableOpacity>
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
              text={item.rating}
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
          <Image
            source={require('assets/images/heart-yellow-outline.png')}
            style={styles.heartIcon}
          />
          <View style={styles.starView}>
            <Image source={require('assets/images/star.png')} />
            <MyText
              text={item.rating}
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
          textColor={Colors.LIGHT_GREY}
        />
      </TouchableOpacity>
    );
  };
  const renderProductCategory = ({item}) => {
    // console.log('renderCategory', item);
    return (
      <TouchableOpacity onPress={() => {}} style={styles.categoryContainer}>
        {item.category_image ? (
          <Image source={{uri: item.category_image}} style={styles.catImg} />
        ) : null}
        <MyText
          text={item.category_name}
          fontFamily="regular"
          fontSize={13}
          textColor={Colors.LIGHT_GREY}
        />
      </TouchableOpacity>
    );
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
          <SearchWithIconDummy
            icon={<Image source={require('assets/images/yellow-seach.png')} />}
            placeholder="Search by course, creator or product name"
            onPress={gotoSearchAllType}
          />
          <FlatList
            data={homeData?.all_tags || []}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 11}}
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
                text="Browse Courses by categories"
                onPress={gotoTopCategory}
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
          {homeData?.suggested_course?.length > 0 ? (
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
          )}
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
                onPress={gotoTopCategory}
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
