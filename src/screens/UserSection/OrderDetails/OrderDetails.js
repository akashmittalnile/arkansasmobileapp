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
  Platform,
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
import {styles} from './OrderDetailsStyle';
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
import RNFetchBlob from 'rn-fetch-blob';

const OrderDetails = ({navigation, dispatch, route}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [orderData, setOrderData] = useState(false);

  useEffect(() => {
    getOrderDetail();
  }, []);
  const getOrderDetail = async () => {
    setShowLoader(true);
    const formdata = new FormData();
    formdata.append('order_id', route?.params?.order_id);
    formdata.append('item_id', route?.params?.item_id);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.ORDER_DETAIL,
        formdata,
      );
      console.log('getOrderDetail resp', resp?.data);
      if (resp?.data?.status) {
        const isCourseExist = resp.data.items?.find(el => el.type == '1');
        if (isCourseExist) {
          resp.data.items = await generateThumb(resp?.data?.items);
          setOrderData(resp?.data);
        } else {
          setOrderData(resp?.data);
        }
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in getOrderDetail', error);
    }
    setShowLoader(false);
  };
  const generateThumb = async data => {
    console.log('generateThumb', JSON.stringify(data));
    let updatedData = [...data];
    try {
      updatedData = await Promise.all(
        data?.map?.(async el => {
          if (el?.type == '2') {
            return el;
          }
          // console.log('here', JSON.stringify(el));
          const thumb = await createThumbnail({
            url: el?.video,
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
    console.log('thumb data order details', updatedData);
    return updatedData;
  };

  const downloadInvoice = async () => {
    console.log('downloadInvoice', orderData?.invoice);
    let pdfUrl = orderData?.invoice;
    let DownloadDir =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir;
    const {dirs} = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: 'Arkansas',
      path: `${dirToSave}.pdf`,
    };
    console.log('here');
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: 'pdf',
      },
      android: configfb,
    });
    Platform.OS == 'android'
      ? RNFetchBlob.config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: `${DownloadDir}/.pdf`,
            description: 'Arkansas',
            title: `${orderData?.data?.order_number} invoice.pdf`,
            mime: 'application/pdf',
            mediaScannable: true,
          },
        })
          .fetch('GET', `${pdfUrl}`)
          .catch(error => {
            console.warn(error.message);
          })
      : RNFetchBlob.config(configOptions)
          .fetch('GET', `${pdfUrl}`, {})
          .then(res => {
            if (Platform.OS === 'ios') {
              RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
              RNFetchBlob.ios.previewDocument(configfb.path);
            }
            console.log('The file saved to ', res);
          })
          .catch(e => {
            console.log('The file saved to ERROR', e.message);
          });
  };

  const RenderItem = ({item}) => {
    // console.log('item', item);
    return (
      <View style={styles.courseContainer}>
        <View style={styles.courseTopRow}>
          <MyText
            text={`Order ID: ${orderData?.data?.order_number}`}
            fontFamily="medium"
            fontSize={12}
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <MyText
              text={'order_status'}
              fontFamily="medium"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{marginLeft: 5}}
            />
          </View>
        </View>
        <View style={styles.courseSubContainer}>
          <ImageBackground
            source={
              item?.type == '1' ? {uri: item?.thumb?.path} : {uri: item?.image}
            }
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
                  source={{uri: item?.creator_image}}
                  style={styles.createImgStyle}
                />
                <MyText
                  text={item.creator_name}
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
                text={'$' + item?.total_amount_paid}
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
          text={orderData?.data?.order_date}
          fontFamily="medium"
          fontSize={12}
          textColor={Colors.LIGHT_GREY}
          style={{}}
        />
      </View>
    );
  };
  const Summary = ({}) => {
    return (
      <View style={styles.summaryContainer}>
        <View style={[styles.row, {marginBottom: 10}]}>
          <MyText
            // text={`Total Amount (1)`}
            text={`Total Amount`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
          <MyText
            text={'$100'}
            fontSize={14}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
        </View>
        <View style={[styles.row, {marginBottom: 19}]}>
          <MyText
            text={`Tax`}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
          <MyText
            text={'$100'}
            fontSize={14}
            fontFamily="medium"
            textColor={'#8F93A0'}
            style={{}}
          />
        </View>
        <Divider style={{borderColor: '#E0E0E0'}} />
        <View style={[styles.row, {marginTop: 14}]}>
          <MyText
            text={`Shipping Cost`}
            fontSize={18}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
          <MyText
            text={'$100'}
            fontSize={18}
            fontFamily="medium"
            textColor={'#455A64'}
            style={{}}
          />
        </View>
      </View>
    );
  };
  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Order Details" isBackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          style={styles.mainView}>
          {orderData?.items && Array.isArray(orderData?.items) ? (
            <>
              <RenderItem item={orderData?.items?.find(el => el.is_primary)} />
              {orderData?.items?.length > 1 ? (
                <>
                  <MyText
                    text={'Other Items'}
                    fontFamily="medium"
                    fontSize={16}
                    textColor={Colors.THEME_BROWN}
                    style={{marginBottom: 10}}
                  />
                  {orderData?.items
                    ?.filter(el => !el.is_primary)
                    ?.map(item => (
                      <RenderItem item={item} />
                    ))}
                </>
              ) : null}
            </>
          ) : null}
          <Summary />

          <View style={styles.amountContainer}>
            <ImageBackground
              source={require('assets/images/amount-bg.png')}
              style={styles.amountContainer}>
              <View style={styles.whiteCircle3}>
                <View style={styles.whiteCircle2}>
                  <Image source={require('assets/images/amount-icon.png')} />
                </View>
              </View>
              <View style={{marginLeft: 12}}>
                <MyText
                  text={'Total Amount'}
                  fontFamily="regular"
                  fontSize={14}
                  textColor={Colors.WHITE}
                  style={{}}
                />
                <MyText
                  text={'$' + orderData?.data?.total_amount}
                  fontFamily="bold"
                  fontSize={16}
                  textColor={Colors.WHITE}
                  style={{marginTop: 5}}
                />
              </View>
            </ImageBackground>
          </View>
          <MyButton
            text="DOWNLOAD INVOICE"
            style={{
              width: width * 0.9,
              marginBottom: 10,
              backgroundColor: Colors.THEME_BROWN,
              marginTop: 32,
            }}
            onPress={downloadInvoice}
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
export default connect(null, mapDispatchToProps)(OrderDetails);

const itemData = {
  order_id: '32',
  order_date: '11 Oct, 2023 05:17AM',
  order_number: 'AKS32653321',
  product_id: '4',
  title: 'Activated charcoal',
  description:
    'Commonly used in emergency rooms across the world as an antidote to the ingestion of toxic amounts of illegal or prescription drugs, charcoal is given in an attempt to minimize the number of toxins that are absorbed into the gut. In theory, it may also be useful in preventing toxins that may be absorbed through diet. Available in tablet or powder form.',
  total_amount_paid: '200',
  price: '200',
  category_id: '7',
  category_name: 'Body detox',
  avg_rating: '4.7',
  order_status: 'Paid',
  content_creator_image:
    'http://nileprojects.in/arkansas/public/upload/profile-image/1696397010.jpg',
  content_creator_name: 'Arkansas ',
  content_creator_id: 1,
  isReviewed: 0,
};
