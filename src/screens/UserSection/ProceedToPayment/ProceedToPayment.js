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
import {styles} from './ProceedToPaymentStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
// import {WebView} from 'react-native-webview';
import MyButton from '../../../components/MyButton/MyButton';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';
import ViewAll from '../../../components/ViewAll/ViewAll';
import SuccessfulyPurchased from '../../../modals/SuccessfulyPurchased/SuccessfulyPurchased';
import {CommonActions} from '@react-navigation/native';
import AddCard from '../../../modals/AddCard/AddCard';

const ProceedToPayment = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [showSuccessfulyPurchasedModal, setShowSuccessfulyPurchasedModal] =
    useState(false);
  const [selectedCard, setSelectedCard] = useState('');
  const [cardList, setCardList] = useState([
    {
      id: '1',
      img: require('assets/images/mastercard.png'),
      cardNum: '1111 1111 1111 5967',
      expires: '24/22',
    },
    {
      id: '2',
      img: require('assets/images/visa.png'),
      cardNum: '1111 1111 1111 5967',
      expires: '24/22',
    },
  ]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [screenData, setScreenData] = useState({});
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    setShowLoader(true);
    try {
      const resp = await Service.getApiWithToken(
        userToken,
        Service.CART_DETAILS_PAYMENT,
      );
      console.log('getData resp', resp?.data);
      if (resp?.data?.status) {
        // show message only when no cards found
        resp?.data?.data?.length === 0 && Toast.show(resp.data.message, Toast.SHORT);
        setScreenData(resp?.data);
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in getData', error);
    }
    setShowLoader(false);
  };
  const resetIndexGoToUserBottomTab = CommonActions.reset({
    index: 1,
    routes: [{name: ScreenNames.BOTTOM_TAB}],
  });
  const onConfirm = async () => {
    if(selectedCard === ''){
      Toast.show('Please select a card', Toast.SHORT)
      return
    }
    const postData = new FormData()
    postData.append('card_id', selectedCard)
    console.log('onConfirm postData', postData);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.SAVE_ORDER,
        postData
      );
      console.log('onConfirm resp', resp);
      if (resp?.data?.status) {
        Toast.show(resp.data.message, Toast.SHORT);
        openSuccessfulyPurchasedModal()
        // navigation.dispatch(resetIndexGoToUserBottomTab);
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in onConfirm', error);
    }
    setShowLoader(false);
  };

  const openSuccessfulyPurchasedModal = () => {
    setShowSuccessfulyPurchasedModal(true);
  };
  const openAddCardModal = () => {
    setShowAddCardModal(true);
  };
  const resetIndexGoToMyOrders = CommonActions.reset({
    index: 1,
    // routes: [{name: ScreenNames.MY_ORDERS}],
    routes: [{name: ScreenNames.BOTTOM_TAB}],
  });
  const gotoMyCourses = () => {
    navigation.dispatch(resetIndexGoToMyOrders);
  };
  const changeSelectedCard = id => {
    setSelectedCard(id);
  };
  const deleteCard = id => {
    const cardListCopy = [...cardList];
    const updatedData = cardListCopy.filter(el => el.id !== id);
    setCardList([...updatedData]);
    // setSelectedCard(id);
  };

  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Select payment method" isBackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          style={styles.mainView}>
          <View style={styles.summaryContainer}>
            <View style={[styles.row, {marginBottom: 10}]}>
              <MyText
                text={`Subtotal (${screenData?.order_count})`}
                fontSize={14}
                fontFamily="medium"
                textColor={'#455A64'}
                style={{}}
              />
              <MyText
                text={`$${Number(screenData?.sub_total).toFixed(2)}`}
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
                text={`$${Number(screenData?.discount).toFixed(2)}`}
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
                text={`$${Number(screenData?.shipping).toFixed(2)}`}
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
                text={`$${Number(screenData?.total).toFixed(2)}`}
                fontSize={18}
                fontFamily="medium"
                textColor={'#455A64'}
                style={{}}
              />
            </View>
          </View>
          <ViewAll
            text="Cards"
            buttonText="Add New"
            onPress={openAddCardModal}
            style={{marginTop: 25, marginBottom: 21}}
          />
          {screenData?.data?.length > 0 ? (
            screenData?.data?.map(item => (
              <TouchableOpacity
                key={item.card_id}
                onPress={() => {
                  changeSelectedCard(item.card_id);
                }}
                style={[
                  styles.cardContainer,
                  item.card_id === selectedCard
                    ? {borderWidth: 1, borderColor: Colors.THEME_GOLD}
                    : null,
                ]}>
                <View style={styles.cardContainerLeftRow}>
                  <Image
                    source={
                      item.card_id === selectedCard
                        ? require('assets/images/selected.png')
                        : require('assets/images/not-selected.png')
                    }
                  />
                  <Image source={getCardImage(item.type)} style={{marginLeft: 15}} />
                  <View style={{marginLeft: 12}}>
                    <MyText
                      text={'**** **** **** ' + item.card_number.slice(-5)}
                      // text={item.card_number}
                      fontSize={16}
                      fontFamily="medium"
                      textColor={'#261313'}
                    />
                    <MyText
                      text={`Expires ${item.valid_upto}`}
                      fontSize={14}
                      fontFamily="light"
                      textColor={Colors.LIGHT_GREY}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    deleteCard(item.id);
                  }}>
                  <Image source={require('assets/images/trash.png')} />
                </TouchableOpacity>
              </TouchableOpacity>
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
          <MyButton
            text="CONFIRM"
            style={{
              width: width * 0.9,
              marginBottom: 10,
              backgroundColor: Colors.THEME_BROWN,
              marginTop: 32,
            }}
            // onPress={openSuccessfulyPurchasedModal}
            onPress={onConfirm}
          />
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
        <SuccessfulyPurchased
          visible={showSuccessfulyPurchasedModal}
          setVisibility={setShowSuccessfulyPurchasedModal}
          gotoMyCourses={gotoMyCourses}
        />
        <AddCard
          visible={showAddCardModal}
          setVisibility={setShowAddCardModal}
          setShowLoader={setShowLoader}
          userToken={userToken}
          callFunctionAfterAddingcard={getData}
        />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(ProceedToPayment);

const getCardImage = (type) => {
  if(type === 'VISA'){
    return require('assets/images/visa.png')
  } else if(type === 'MASTERCARD'){
    return require('assets/images/mastercard.png')
  } else {
    return require('assets/images/mastercard.png')
  }
}