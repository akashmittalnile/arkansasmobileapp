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
  const [searchValue, setSearchValue] = useState('');
  const [homeData, setHomeData] = useState({});
  const [selectedCourseType, setSelectedCourseType] = useState('1');
  const [trendingCourses, setTrendingCourses] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('userToken', userToken);
      getHomeData();
    });
    return unsubscribe;
  }, [navigation]);
  const getHomeData = async () => {
    setShowLoader(true);
    try {
      const resp = await Service.getApiWithToken(userToken, Service.HOME);
      console.log('getHomeData resp', resp);
      if (resp?.data?.status) {
        const dataWithThumb = await generateThumb(resp?.data?.data);
        setHomeData(dataWithThumb);
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in getHomeData', error);
    }
    setShowLoader(false);
  };

  const generateThumb = async data => {
    console.log('generateThumb');
    try {
      data.trending_course = await Promise.all(
        data?.trending_course?.map?.(async el => {
          const thumb = await createThumbnail({
            url: el.introduction_video,
            timeStamp: 1000,
          });
          for (const [key, value] of Object.entries(thumb)) {
            console.log(`thumb ind ${key}: ${value}`);
          }
          console.log();
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
      data.suggested_course = await Promise.all(
        data?.suggested_course?.map?.(async el => {
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

    console.log('thumb data', data);
    return data;
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
  const gotoProductDetails = item => {
    navigation.navigate(ScreenNames.PRODUCT_DETAILS, {courseData: item});
  };
  const gotoAllProducts = () => {
    navigation.navigate(ScreenNames.ALL_PRODUCTS);
  };
  const gotoSuggestedProducts = () => {
    navigation.navigate(ScreenNames.SUGGESTED_PRODUCTS);
  };

  const changeSelectedCourseType = id => {
    setSelectedCourseType(id);
  };
  const renderCourseTypes = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => changeSelectedCourseType(item.id)}
        style={[
          styles.courseTypeContainer,
          selectedCourseType === item.id
            ? {backgroundColor: Colors.THEME_BROWN}
            : null,
        ]}>
        <MyText
          text={item.name}
          fontFamily="regular"
          fontSize={14}
          textColor={
            selectedCourseType === item.id ? Colors.THEME_GOLD : 'black'
          }
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
    return (
      <TouchableOpacity
        onPress={() => gotoProductDetails(item)}
        style={styles.courseContainer}>
        <View style={styles.topRow}>
          <View style={styles.topLeftRow}>
            <Image source={{uri: item.creatorImg}} style={styles.crtrImg} />
            <MyText
              text={item.creatorName}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_GOLD}
              letterSpacing={0.13}
              style={{marginLeft: 10}}
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
        <ImageBackground source={item.courseImg} style={styles.crseImg}>
          <TouchableOpacity>
            <Image source={require('assets/images/play-icon.png')} />
          </TouchableOpacity>
        </ImageBackground>
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
                text={'Course Fee:'}
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
      <TouchableOpacity style={styles.productContainer}>
        <View>
          <Image source={{uri: item.Product_image}} style={{width: '100%'}} />
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
            <TouchableOpacity style={styles.prodCartView}>
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
  const renderCategory = ({item}) => {
    console.log('renderCategory', item);
    return (
      <View style={styles.categoryContainer}>
        <Image source={{uri: item.category_image}} style={styles.catImg} />
        <MyText
          text={item.category_name}
          fontFamily="regular"
          fontSize={13}
          textColor={Colors.LIGHT_GREY}
        />
      </View>
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
          <SearchWithIcon
            value={searchValue}
            setValue={setSearchValue}
            icon={<Image source={require('assets/images/yellow-seach.png')} />}
            placeholder="Search by course, creator or product name"
            // style={{
            //   width: Constant.width - 40,
            //   alignSelf: 'center',
            //   marginTop: -25,
            // }}
          />
          <FlatList
            data={courseTypes}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{marginTop: 11}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderCourseTypes}
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
          {homeData?.top_category?.length > 0 ? (
            <View>
              <ViewAll
                text="Top Category"
                onPress={gotoTopCategory}
                style={{marginTop: 21}}
              />
              <FlatList
                data={homeData?.top_category || []}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 15}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCategory}
              />
            </View>
          ) : (
            <MyText
              text={`No Top Categories found`}
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
                onPress={gotoSuggestedCourses}
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
          {homeData?.suggested_category?.length > 0 ? (
            <View>
              <ViewAll
                text="Explore Category"
                onPress={gotoTopCategory}
                style={{marginTop: 21}}
              />
              <FlatList
                data={homeData?.suggested_category || []}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{marginTop: 15}}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderCategory}
              />
            </View>
          ) : (
            <MyText
              text={`No Explore Category found`}
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
        <CustomLoader showLoader={showLoader} />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(Home);
