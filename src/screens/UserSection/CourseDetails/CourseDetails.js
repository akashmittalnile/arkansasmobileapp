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
import {styles} from './CourseDetailsStyle';
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
import {createThumbnail} from 'react-native-create-thumbnail';
import Review from '../../../modals/Review/Review';
import VideoModal from '../../../components/VideoModal/VideoModal';

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
const CourseDetails = ({navigation, dispatch, route}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedTag, setSelectedTag] = useState('1');
  const [productDetails, setProductDetails] = useState({});
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
      console.log('getProductDetails resp', resp?.data);
      if (resp?.data?.status) {
        const data = await generateThumb(resp?.data?.data);
        setProductDetails(data);
        // Toast.show(resp?.data?.message, Toast.SHORT)
      } else {
        Toast.show(resp?.data?.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in getProductDetails', error);
    }
    setShowLoader(false);
  };

  const generateThumb = async data => {
    console.log('generateThumb');
    try {
      const thumb = await createThumbnail({
        url: data.introduction_video,
        timeStamp: 1000,
      });
      data.thumb = thumb;

      // create thumbnails for chapter_step videos
      const chapterData = [...data?.chapters];
      const updatedChapterData = await Promise.all(
        chapterData?.map(async chap => {
          const returned = await Promise.all(
            chap?.chapter_steps?.map(async chapstep => {
              console.log('chapstep', chapstep);
              if (chapstep?.type === 'video') {
                const thumb = await createThumbnail({
                  url: chapstep?.file,
                  timeStamp: 1000,
                });
                console.log('chapstep thumb', {
                  ...chapstep,
                  thumb,
                });
                return {
                  ...chapstep,
                  thumb,
                };
              } else {
                return chapstep;
              }
            }),
          );
          console.log('chap inside', {...chap, chapter_steps: returned});
          return {...chap, chapter_steps: returned};
        }),
      );

      console.log('updatedChapterData', updatedChapterData);
      data.chapters = updatedChapterData;
      console.log('generateThumb data', data);
      return data;
    } catch (error) {
      console.error('Error generating thumbnails:', error);
    }
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
    formdata.append('status', status === '1' ? '0' : '1');
    console.log('onLike formdata', formdata);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        status === '1' ? UNLIKE_OBJECT_TYPE : Service.LIKE_OBJECT_TYPE,
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
  const markAsCompleted = async chapter_step_id => {
    setShowLoader(true);
    const formdata = new FormData();
    formdata.append('chapter_step_id', chapter_step_id);
    console.log('markAsCompleted formdata', formdata);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.MARK_AS_COMPLETE,
        formdata,
      );
      console.log('markAsCompleted resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show(resp.data.message, Toast.SHORT);
        getProductDetails();
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in markAsCompleted', error);
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
        <MyHeader Title="Course Details" isBackButton />
        {/* <MyHeader Title="Home" isBackButton /> */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          style={styles.mainView}>
          <ImageBackground
            source={{uri: productDetails?.thumb?.path}}
            // source={require('assets/images/rectangle-1035.png')}
            style={styles.crseImg}
            imageStyle={{borderRadius: 10}}>
            <TouchableOpacity>
              <Image source={require('assets/images/play-icon.png')} />
            </TouchableOpacity>
          </ImageBackground>

          <View style={styles.topRow}>
            <MyText
              text={productDetails?.title}
              fontFamily="regular"
              fontSize={16}
              textColor={'black'}
              style={{width: '80%'}}
            />
            <MyText
              text={`$${productDetails?.course_fee}`}
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
              <Image
                source={require('assets/images/profile-circle.png')}
                // style={styles.crtrImg}
              />
              <MyText
                text={productDetails?.content_creator_name}
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
                  onLike('1', productDetails.id, productDetails.isWishlist);
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
          <View style={styles.validDateRow}>
            <Image source={require('assets/images/myyy2.png')} />
            <MyText
              // text={`Course Valid Date: 26 Juny 2023`}
              text={`Course Valid Date: ${productDetails?.valid_upto}`}
              fontFamily="medium"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{marginLeft: 5}}
            />
          </View>
          {showModal.isVisible ? (
            <VideoModal
              isVisible={showModal.isVisible}
              toggleModal={toggleModal}
              videoDetail={{...showModal?.data, url: showModal?.data?.file}}
              // {...props}
            />
          ) : null}
          <View style={styles.bottomRow}>
            <View style={styles.chaptersRow}>
              <Image source={require('assets/images/chapter-icon.png')} />
              <MyText
                text={`${productDetails?.chapter_count} Chapters`}
                fontFamily="regular"
                fontSize={13}
                textColor={Colors.LIGHT_GREY}
                style={{marginLeft: 5}}
              />
            </View>
            <View style={styles.quizRow}>
              <Image source={require('assets/images/quiz-icon.png')} />
              <MyText
                text={`${productDetails?.chapter_quiz_count} Quiz Questions `}
                fontFamily="regular"
                fontSize={13}
                textColor={Colors.LIGHT_GREY}
                style={{marginLeft: 5}}
              />
            </View>
          </View>
          <MyText
            text={productDetails?.description}
            fontFamily="regular"
            fontSize={13}
            textColor={Colors.LIGHT_GREY}
            style={{width: '100%', marginTop: 17}}
          />

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
          {/* {reviewsData?.map(item => (
            <View key={item.id} style={styles.reviewContainer}>
              <View style={styles.reviewTopRow}>
                <View style={styles.reviewTopLeftRow}>
                  <Image source={{uri: item.img}} style={styles.reviewImg} />
                  <MyText
                    text={item.name}
                    fontFamily="medium"
                    fontSize={13}
                    textColor={Colors.LIGHT_GREY}
                    style={{marginLeft: 10}}
                  />
                </View>
                <Image source={require('assets/images/message-text.png')} />
              </View>
              <MyText
                text={item.msg}
                fontFamily="medium"
                fontSize={13}
                textColor={Colors.LIGHT_GREY}
                style={{marginTop: 10}}
              />
            </View>
          ))} */}
          {productDetails?.chapters
            ?.filter(el => el?.chapter_steps?.length > 0)
            ?.map((chap, index) => (
              <>
                <ViewAll
                  key={index?.toString()}
                  text={`Chapter ${index + 1}`}
                  style={{marginTop: 10, marginBottom: 20}}
                />
                <View
                  // key={chapstepindex?.toString()}
                  style={styles.containerStyle}>
                  <FlatList
                    data={chap?.chapter_steps}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item, index}) => {
                      // console.log('FlatList item', item);
                      return (
                        <AccordionItem
                          item={item}
                          index={index}
                          documents={documents}
                          setDocuments={setDocuments}
                          uploadDocument={uploadDocument}
                          deleteDocument={deleteDocument}
                          setShowModal={setShowModal}
                          markAsCompleted={markAsCompleted}
                          allChapterSteps={chap?.chapter_steps}
                        />
                      );
                    }}
                  />
                </View>
              </>
            ))}
          <View style={{height: 37}}></View>
          <ViewAllSub
            text="Ratings & Reviews"
            rating={productDetails?.rating}
            reviews={productDetails?.review_count}
            onPress={gotoAllReviews}
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
export default connect(null, mapDispatchToProps)(CourseDetails);

const ViewAllSub = ({
  text,
  rating,
  reviews,
  onPress,
  style = {},
  buttonText = 'See All',
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
      <TouchableOpacity onPress={onPress} style={styles.viewAll}>
        <MyText
          text={buttonText}
          fontFamily="regular"
          fontSize={13}
          textColor={Colors.THEME_GOLD}
        />
      </TouchableOpacity>
    </View>
  );
};
