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
import {styles} from './WishlistStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
// import {WebView} from 'react-native-webview';
import MyButton from '../../../components/MyButton/MyButton';

const courseList = [
  {
    id: '1',
    creatorName: `Max Bryrant`,
    courseImg: require('assets/images/rectangle-1035.png'),
    courseName: 'Tattoo Cover-Ups & Transformations',
    courseRating: '4.7',
    courseFee: '399.00',
  },
  {
    id: '2',
    creatorName: `Max Bryrant`,
    courseImg: require('assets/images/rectangle-1035.png'),
    courseName: 'Tattoo Cover-Ups & Transformations',
    courseRating: '4.7',
    courseFee: '399.00',
  },
  {
    id: '3',
    creatorName: `Max Bryrant`,
    courseImg: require('assets/images/rectangle-1035.png'),
    courseName: 'Tattoo Cover-Ups & Transformations',
    courseRating: '4.7',
    courseFee: '399.00',
  },
  {
    id: '4',
    creatorName: `Max Bryrant`,
    courseImg: require('assets/images/rectangle-1035.png'),
    courseName: 'Tattoo Cover-Ups & Transformations',
    courseRating: '4.7',
    courseFee: '399.00',
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
  },
  {
    id: '2',
    creatorName: `Nikhil Sam`,
    courseImg: require('assets/images/prod-img-2.png'),
    courseName: `O'Reilly's tattoo machine Motor`,
    courseRating: '4.7',
    courseFee: '399.00',
  },
  {
    id: '3',
    creatorName: `Nikhil Sam`,
    courseImg: require('assets/images/prod-img-3.png'),
    courseName: `O'Reilly's tattoo machine Motor`,
    courseRating: '4.7',
    courseFee: '399.00',
  },
  {
    id: '4',
    creatorName: `Nikhil Sam`,
    courseImg: require('assets/images/prod-img-3.png'),
    courseName: `O'Reilly's tattoo machine Motor`,
    courseRating: '4.7',
    courseFee: '399.00',
  },
];

const Wishlist = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedTab, setSelectedTab] = useState('1');
  const [courseData, setCourseData] = useState([]);
  const [productData, setProductData] = useState([]);
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

  useEffect(() => {
    getAllType()
  }, [])
  const getAllType = async (type = '1') => {
    setShowLoader(true);
    const formdata = new FormData();
    formdata.append("type", type)
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.ALL_TYPE_LISTING,
        formdata
      );
      console.log('getAllType resp', resp?.data);
      if (resp?.data?.status) {
        type === '1' ? setCourseData(resp?.data?.data) : setProductData(resp?.data?.data)
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in getAllType', error);
    }
    setShowLoader(false);
  };
  const onLike = async (type, id, status) => {
    setShowLoader(true);
    const formdata = new FormData();
    formdata.append("type", type);
    formdata.append("id", id);
    formdata.append("status", status === '1' ? '0' : '1');
    console.log('onLike formdata', formdata);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.LIKE_OBJECT_TYPE,
        formdata
      );
      console.log('onLike resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show(resp.data.Message, Toast.SHORT);
        getAllType(type)
      } else {
        Toast.show(resp.data.Message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in onLike', error);
    }
    setShowLoader(false);
  };

  const changeSelectedTab = id => {
    setSelectedTab(id);
    getAllType(id)
  };

  const renderCourse = ({item}) => {
    return (
      <View style={styles.courseContainer}>
        <ImageBackground
          // source={item.courseImg}
          source={{uri: item.certificates_image}}
          style={styles.crseImg}
          imageStyle={{borderRadius: 10}}>
          <TouchableOpacity>
            <Image source={require('assets/images/play-icon.png')} />
          </TouchableOpacity>
        </ImageBackground>
        <View style={{marginLeft: 11, width: width * 0.42}}>
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
                text={item.rating}
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
                text={'Max Bryant'}
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
              text={'$' + item.course_fee}
              fontFamily="bold"
              fontSize={14}
              textColor={Colors.THEME_GOLD}
              letterSpacing={0.14}
              style={{}}
            />
            <View style={styles.iconsRow}>
              <TouchableOpacity onPress={()=>{onLike('1', item.id, item.isLike)}} >
                <Image source={item.isLike ? require('assets/images/heart-selected.png') : require('assets/images/heart-yellow-outline.png')} style={{width: 14, height: 14}} />
              </TouchableOpacity>
              <Image
                source={require('assets/images/share.png')}
                style={{marginLeft: 10}}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };
  const renderProduct = ({item}) => {
    return (
      <View style={styles.courseContainer}>
        <ImageBackground source={{uri: item.Product_image}} style={styles.crseImg}>
          {/* <TouchableOpacity>
            <Image source={require('assets/images/play-icon.png')} />
          </TouchableOpacity> */}
        </ImageBackground>
        <View style={{marginLeft: 11, width: width * 0.42}}>
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
                text={item.rating}
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
                text={'Nikhil Sam'}
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
              text={'$' + item.price}
              fontFamily="bold"
              fontSize={14}
              textColor={Colors.THEME_GOLD}
              letterSpacing={0.14}
              style={{}}
            />
            <View style={styles.iconsRow}>
            <TouchableOpacity onPress={()=>{onLike('2', item.id, item.isLike)}} >
              <Image source={item.isLike ? require('assets/images/heart-selected.png') : require('assets/images/heart-yellow-outline.png')} style={{width: 14, height: 14}} />
            </TouchableOpacity>  
              <Image
                source={require('assets/images/share.png')}
                style={{marginLeft: 10}}
              />
            </View>
          </View>
        </View>
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
              // data={courseList}
              data={courseData}
              style={{marginTop: 28}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderCourse}
            />
          ) : (
            <FlatList
              // data={productList}
              data={productData}
              style={{marginTop: 28}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderProduct}
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
export default connect(null, mapDispatchToProps)(Wishlist);
