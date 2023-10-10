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
import {styles} from './ProductDetailsStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
// import {WebView} from 'react-native-webview';
import MyButton from '../../../components/MyButton/MyButton';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import AccordionItem from '../../../components/AccordionItem/AccordionItem';
import ViewAll from '../../../components/ViewAll/ViewAll';
import FAB_Button from '../../../components/FAB_Button/FAB_Button';
import Review from '../../../modals/Review/Review';
import VideoModal from '../../../components/VideoModal/VideoModal';
import Carousel from '../../../components/Carousel/Carousel';

const data = [
  {
    id: 1,
    title: 'New Methods to try',
    description:
      'How to create animated swipe button from react native? Here we use react native reanimated v2 for creating this swipe button. React native animations are something that was complicated for me at the beginning.',
    time: '15:00',
  },
  {
    id: 3,
    title: 'How to use coding ',
    description:
      'How to create animated swipe button from react native? Here we use react native reanimated v2 for creating this swipe button. React native animations are something that was complicated for me at the beginning.',
    time: '15:00',
  },
  {
    id: 4,
    title: 'What is coding about',
    description:
      'How to create animated swipe button from react native? Here we use react native reanimated v2 for creating this swipe button. React native animations are something that was complicated for me at the beginning.',
    time: '15:00',
  },
  {
    id: 5,
    title: 'How to create animations',
    description:
      'How to create animated swipe button from react native? Here we use react native reanimated v2 for creating this swipe button. React native animations are something that was complicated for me at the beginning.',
    time: '15:00',
  },
  {
    id: 6,
    title: 'Possible to create layout animations?',
    description:
      'How to create animated swipe button from react native? Here we use react native reanimated v2 for creating this swipe button. React native animations are something that was complicated for me at the beginning.',
    time: '15:00',
  },
  {
    id: 7,
    title: 'How to Create Swipe Buttons',
    description:
      'How to create animated swipe button from react native? Here we use react native reanimated v2 for creating this swipe button. React native animations are something that was complicated for me at the beginning.',
    time: '15:00',
  },
];
const reviewsData = [
  {
    id: '1',
    name: 'Annete Black',
    img: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`,
    msg: `Perfectly packed all products received as said...but when connected with power supply it doesn't work, After some adjustments it worked perfectly felt very happy with the product. Thank you`,
  },
  {
    id: '2',
    name: 'Annete Black',
    img: `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`,
    msg: `Perfectly packed all products received as said...but when connected with power supply it doesn't work, After some adjustments it worked perfectly felt very happy with the product. Thank you`,
  },
];
const tags = [
  {name: 'Tatoos', id: '1'},
  {name: 'Tatoos Course', id: '2'},
  {name: 'Tatoos 2023', id: '3'},
  {name: 'Body Piercing', id: '4'},
];
const ProductDetails = ({navigation, dispatch, route}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedTag, setSelectedTag] = useState('1');
  const [productDetails, setProductDetails] = useState({});
  const [sliderData, setSliderData] = useState([]);
  const [review, setReview] = useState('');
  const [starRating, setStarRating] = useState(1);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showModal, setShowModal] = useState({isVisible: false, data: null});
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    getProductDetails();
  }, []);
  const getProductDetails = async () => {
    const postData = new FormData();
    postData.append('type', route?.params?.type);
    postData.append('id', route?.params?.id);
    // postData.append('id', 3);
    console.log('getProductDetails postData', postData);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.OBJECT_TYPE_DETAILS,
        postData,
      );
      console.log('getProductDetails resp', resp?.data?.data);
      if (resp?.data?.status) {
        setProductDetails(resp?.data?.data);
        const sliData = resp?.data?.data?.Product_image?.map(el => ({
          slider: el,
        }));
        setSliderData([...sliData]);
        // Toast.show(resp?.data?.message, Toast.SHORT)
      } else {
        Toast.show(resp?.data?.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in getProductDetails', error);
    }
    setShowLoader(false);
  };

  const changeSelectedTag = id => {
    setSelectedTag(id);
  };

  const renderTags = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => changeSelectedTag(item.id)}
        style={[
          styles.courseTypeContainer,
          selectedTag === item?.id
            ? {backgroundColor: Colors.THEME_BROWN}
            : null,
        ]}>
        <MyText
          text={item?.name}
          fontFamily="regular"
          fontSize={14}
          textColor={selectedTag === item.id ? Colors.THEME_GOLD : 'black'}
        />
      </TouchableOpacity>
    );
  };

  const gotoAllReviews = () => {
    navigation.navigate(ScreenNames.ALL_REVIEWS, {
      id: productDetails?.id,
      type: '1',
    });
  };

  const submitReview = async () => {
    if (review?.trim()?.length === 0) {
      Toast.show('Please enter review');
      return;
    }
    const postData = new FormData();
    postData.append('id', route?.params?.id);
    postData.append('type', route?.params?.type);
    postData.append('comment', review);
    postData.append('rating', starRating);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.SUBMIT_REVIEW,
        postData,
      );
      console.log('submitReview resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show(resp?.data?.message || resp?.data?.Message, Toast.SHORT);
        setStarRating(1);
        setReview('');
      } else {
        Toast.show(resp?.data?.message || resp?.data?.Message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in submitReview', error);
    }
    setShowReviewModal(false);
    setShowLoader(false);
  };

  const openReviewModal = () => {
    setShowReviewModal(true);
  };

  const onLike = async (type, id, status) => {
    setShowLoader(true);
    const formdata = new FormData();
    formdata.append('type', type);
    formdata.append('id', id);
    formdata.append('status', status == '1' ? '0' : '1');
    console.log('onLike formdata', formdata);
    const endPoint = status == '1' ? Service.UNLIKE_OBJECT_TYPE : Service.LIKE_OBJECT_TYPE
    console.log('onLike endPoint', endPoint);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        endPoint,
        formdata,
      );
      console.log('onLike resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show(resp.data.message, Toast.SHORT);
        getProductDetails();
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in onLike', error);
    }
    setShowLoader(false);
  };
  const toggleModal = state => {
    setShowModal({
      isVisible: state.isVisible,
      data: state.data,
    });
  };
  const deleteDocument = id => {
    const documentsCopy = [...documents];
    const updatedData = documentsCopy?.filter(el => el.id !== id);
    setDocuments([...updatedData]);
  };
  const documentValidation = chapter_step_id => {
    if (documents.find(el => el.id === chapter_step_id)) {
      return true;
    } else {
      Toast.show('Please select assignment file', Toast.SHORT);
      return false;
    }
  };
  const uploadDocument = async chapter_step_id => {
    console.log('uploadDocument called', documents);
    if (documentValidation(chapter_step_id)) {
      const documentWithId = documents.find(el => el.id === chapter_step_id);
      setShowLoader(true);
      try {
        const postData = new FormData();
        postData.append('chapter_step_id', chapter_step_id);
        postData.append('file', {
          name: documentWithId?.resp?.name,
          type: documentWithId?.resp?.type,
          uri: documentWithId?.resp?.uri,
        });
        console.log('uploadDocument postData', postData);
        const resp = await Service.postApiWithToken(
          userToken,
          Service.ASSIGNMENT_UPLOAD_FILE,
          postData,
        );
        console.log('uploadDocument resp', resp?.data);
        if (resp.data.status) {
          Toast.show(resp.data.message, Toast.SHORT);
          deleteDocument(item?.id);
          getProductDetails();
        } else {
          Toast.show(resp.data.message, Toast.SHORT);
        }
      } catch (error) {
        console.log('error in uploadDocument', error);
      }
      setShowLoader(false);
    }
  };
  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Product Details" isBackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          style={styles.mainView}>
          {typeof productDetails === 'object' ? (
            sliderData?.length > 0 ? (
              <Carousel data={sliderData} />
            ) : null
          ) : null}

          <View style={styles.topRow}>
            <MyText
              text={productDetails?.title}
              fontFamily="regular"
              fontSize={16}
              textColor={'black'}
              style={{width: '80%'}}
            />
            <MyText
              text={`$${productDetails?.price}`}
              fontFamily="bold"
              fontSize={14}
              textColor={Colors.THEME_GOLD}
              style={{}}
            />
          </View>
          <View style={styles.middleRow}>
            <View style={styles.ratingRow}>
              <Image source={require('assets/images/star.png')} />
              <MyText
                text={productDetails?.rating}
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
                source={{uri: productDetails?.creator_image}}
                style={styles.createImgStyle}
              />
              <MyText
                text={productDetails?.creator_name}
                fontFamily="regular"
                fontSize={13}
                textColor={Colors.THEME_GOLD}
                letterSpacing={0.13}
                style={{marginLeft: 10}}
              />
            </View>
            <View style={styles.iconsRow}>
              <TouchableOpacity
                onPress={() => {
                  onLike('2', productDetails.id, productDetails.isWishlist);
                }}>
                <Image
                  source={
                    productDetails?.isWishlist
                      ? require('assets/images/heart-selected.png')
                      : require('assets/images/heart.png')
                  }
                  style={{height: 14, width: 14}}
                />
              </TouchableOpacity>
              <Image
                source={require('assets/images/share.png')}
                style={{marginLeft: 10, height: 14, width: 14}}
              />
            </View>
          </View>

          {showModal.isVisible ? (
            <VideoModal
              isVisible={showModal.isVisible}
              toggleModal={toggleModal}
              videoDetail={{...showModal?.data, url: showModal?.data?.file}}
              // {...props}
            />
          ) : null}

          {productDetails?.description ? (
            <MyText
              text={productDetails?.description}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{width: '100%', marginTop: 17}}
            />
          ) : null}

          <ViewAll text="Tags" showSeeAll={false} style={{marginTop: 20}} />
          {productDetails?.tags?.length > 0 ? (
            <FlatList
              data={productDetails?.tags}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginTop: 11}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderTags}
            />
          ) : (
            <MyText
              text={'No Tags found!'}
              fontFamily="medium"
              fontSize={18}
              textAlign="center"
              textColor={'black'}
            />
          )}
          <View style={{height: 37}}></View>
          <ViewAllSub
            text="Ratings & Reviews"
            rating={productDetails?.rating}
            reviews={productDetails?.review_count}
            onPress={gotoAllReviews}
            showButton={productDetails?.review?.length > 0}
            style={{marginBottom: 17}}
          />
          {productDetails?.review?.length > 0 ? (
            productDetails?.review?.map((item, index) => (
              <View key={item.index?.toString()} style={styles.reviewContainer}>
                <View style={styles.reviewTopRow}>
                  <View style={styles.reviewTopLeftRow}>
                    <Image
                      source={{uri: item?.profile_image}}
                      style={styles.reviewImg}
                    />
                    <MyText
                      text={`${item.first_name} ${item.last_name}`}
                      fontFamily="medium"
                      fontSize={13}
                      textColor={Colors.LIGHT_GREY}
                      style={{marginLeft: 10}}
                    />
                  </View>
                  <Image source={require('assets/images/message-text.png')} />
                </View>
                <MyText
                  text={item.review}
                  fontFamily="medium"
                  fontSize={13}
                  textColor={Colors.LIGHT_GREY}
                  style={{marginTop: 10}}
                />
              </View>
            ))
          ) : (
            <MyText
              text={'No Reviews found!'}
              fontFamily="medium"
              fontSize={18}
              textAlign="center"
              textColor={'black'}
            />
          )}
          <View style={styles.buttonsRow}>
            <MyButton
              text="Add to Cart"
              style={{
                width: '48%',
                height: 50,
                backgroundColor: Colors.THEME_BROWN,
              }}
            />
            <MyButton
              text="Buy Now"
              style={{
                width: '48%',
                height: 50,
                backgroundColor: Colors.THEME_GOLD,
              }}
            />
          </View>
          <FAB_Button onPress={openReviewModal} />
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
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
export default connect(null, mapDispatchToProps)(ProductDetails);

const ViewAllSub = ({
  text,
  rating,
  reviews,
  onPress,
  style = {},
  buttonText = 'See All',
  showButton = true,
}) => {
  return (
    <View style={[styles.viewAllContainer, style]}>
      <View>
        <MyText
          text={text}
          fontFamily="medium"
          fontSize={18}
          textColor={'#455A64'}
        />
        <View style={styles.ratingView}>
          <Image
            source={require('assets/images/selected-star.png')}
            style={{height: 10, width: 10}}
          />
          <MyText
            text={rating}
            fontSize={13}
            fontFamily="regular"
            textColor={Colors.LIGHT_GREY}
            style={{marginLeft: 5}}
          />
          <MyText
            text={' (' + reviews + ')'}
            fontSize={13}
            fontFamily="regular"
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
        </View>
      </View>
      {showButton ? (
        <TouchableOpacity onPress={onPress} style={styles.viewAll}>
          <MyText
            text={buttonText}
            fontFamily="regular"
            fontSize={13}
            textColor={Colors.THEME_GOLD}
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
