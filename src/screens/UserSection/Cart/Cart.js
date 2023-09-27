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
  TextInput,
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
import {styles} from './CartStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
// import {WebView} from 'react-native-webview';
import MyButton from '../../../components/MyButton/MyButton';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';
import ViewAll from '../../../components/ViewAll/ViewAll';

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
];

const Cart = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [cartListData, setCartListData] = useState({});

  useEffect(() => {
    getCartList();
  }, []);
  const getCartList = async () => {
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.CART_LIST,
        {},
      );
      console.log('getCartList resp', resp?.data);
      if (resp?.data?.status) {
        setCartListData(resp?.data);
        // Toast.show(resp?.data?.message, Toast.SHORT)
      } else {
        Toast.show(resp?.data?.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in getCartList', error);
    }
    setShowLoader(false);
  };
  const gotoPaymentScreen = () => {
    navigation.navigate(ScreenNames.PROCEED_TO_PAYMENT);
  };

  const changeQuantity = async (item, change) => {
    console.log('changeQuantity', change);
    // return
    const oldQuantity = Number(item?.quantity);
    const isRemoveProduct = oldQuantity === 1 && change === 'minus'
    const newQuantity = change === 'minus' ? oldQuantity - 1 : oldQuantity + 1;
    setShowLoader(true);
    const postData = new FormData();
    postData.append('cart_id', item?.id);
    postData.append('quantity', newQuantity);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.UPDATE_PRODUCT_QUANTITY,
        postData,
      );
      console.log('changeQuantity resp', resp?.data);
      if (resp?.data?.status) {
        if(isRemoveProduct){
          Toast.show(resp?.data?.message, Toast.SHORT)
        }
        getCartList();
      } else {
        Toast.show(resp?.data?.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in changeQuantity', error);
    }
    setShowLoader(false);
  };

  const renderProduct = ({item}) => {
    return (
      <View style={styles.courseContainer}>
        <ImageBackground
          source={{uri: item.Product_image[0]}}
          style={styles.crseImg}></ImageBackground>
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
                text={item.creator_name}
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
            {/* <View style={styles.iconsRow}>
              <Image source={require('assets/images/heart-selected.png')} />
              <Image
                source={require('assets/images/share.png')}
                style={{marginLeft: 10}}
              />
            </View> */}
          </View>
          {item?.type === '2' ? (
            <View style={styles.quantityRow}>
              <TouchableOpacity
                onPress={() => {
                  changeQuantity(item, 'minus');
                }}>
                <Image source={require('assets/images/minus.png')} />
              </TouchableOpacity>
              <View style={styles.quantityView}>
                <MyText
                  text={item?.quantity}
                  fontFamily="regular"
                  fontSize={12}
                  textColor={'black'}
                  style={{}}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  changeQuantity(item, 'add');
                }}>
                <Image source={require('assets/images/add.png')} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    );
  };
  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Cart" isBackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          style={styles.mainView}>
          <FlatList
            data={cartListData?.data}
            style={{}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderProduct}
          />
          <View style={styles.applyCouponRow}>
            <TextInput
              value={promoCode}
              placeholder="Promo Code"
              placeholderTextColor="#C0C0C0"
              onChangeText={value => setPromoCode(value)}
              style={styles.promoInput}
            />
            <TouchableOpacity style={styles.applyButton}>
              <MyText
                text={'Apply'}
                fontFamily="regular"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                style={{}}
              />
            </TouchableOpacity>
          </View>

          <ViewAll
            text="Order Summary"
            showSeeAll={false}
            style={{marginTop: 41}}
          />
          <View style={styles.summaryContainer}>
            <View style={[styles.row, {marginBottom: 10}]}>
              <MyText
                text={`Subtotal (${cartListData?.data?.length})`}
                fontSize={14}
                fontFamily="medium"
                textColor={'#455A64'}
                style={{}}
              />
              <MyText
                text={`$${Number(cartListData?.sub_total).toFixed(2)}`}
                fontSize={14}
                fontFamily="medium"
                textColor={'#455A64'}
                style={{}}
              />
            </View>
            <View style={[styles.row, {marginBottom: 10}]}>
              <MyText
                text={`Discount`}
                fontSize={14}
                fontFamily="medium"
                textColor={'#8F93A0'}
                style={{}}
              />
              <MyText
                text={`$${Number(cartListData?.discount).toFixed(2)}`}
                fontSize={14}
                fontFamily="medium"
                textColor={'#8F93A0'}
                style={{}}
              />
            </View>
            <View style={[styles.row, {marginBottom: 19}]}>
              <MyText
                text={`Shipping`}
                fontSize={14}
                fontFamily="medium"
                textColor={'#455A64'}
                style={{}}
              />
              <MyText
                text={`$${Number(cartListData?.shipping).toFixed(2)}`}
                fontSize={14}
                fontFamily="medium"
                textColor={'#455A64'}
                style={{}}
              />
            </View>
            <Divider style={{borderColor: '#E0E0E0'}} />
            <View style={[styles.row, {marginTop: 14}]}>
              <MyText
                text={`Total`}
                fontSize={18}
                fontFamily="medium"
                textColor={'#455A64'}
                style={{}}
              />
              <MyText
                text={`$${Number(cartListData?.total).toFixed(2)}`}
                fontSize={18}
                fontFamily="medium"
                textColor={'#455A64'}
                style={{}}
              />
            </View>
          </View>
          <MyButton
            text="PROCEED TO PAYMENT"
            style={{
              width: width * 0.9,
              marginBottom: 10,
              backgroundColor: Colors.THEME_BROWN,
              marginTop: 32,
            }}
            onPress={gotoPaymentScreen}
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
export default connect(null, mapDispatchToProps)(Cart);
