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
import {styles} from './SearchAllTypeStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
// import {WebView} from 'react-native-webview';
import MyButton from '../../../components/MyButton/MyButton';
import {createThumbnail} from 'react-native-create-thumbnail';
import FiltersModal from './components/FiltersModal/FiltersModal';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';

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

const SearchAllType = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedTab, setSelectedTab] = useState('1');
  const [temporarySelectedTab, setTemporarySelectedTab] = useState('1');
  const [courseData, setCourseData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [courseCategries, setCourseCategries] = useState([]);
  const [selectedCourseCategries, setSelectedCourseCategries] = useState([]);
  const [tempSelectedCourseCategries, setTempSelectedCourseCategries] =
    useState([]);
  const [productCategries, setProductCategries] = useState([]);
  const [selectedProductCategries, setSelectedProductCategries] = useState([]);
  const [TempSelectedProductCategries, setTempSelectedProductCategries] =
    useState([]);
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
      getAllType();
    });
    return unsubscribe;
  }, [navigation]);
  const getAllType = async (type = '1') => {
    setShowLoader(true);
    const formdata = new FormData();
    formdata.append('type', type);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.ALL_TYPE_LISTING,
        formdata,
      );
      console.log('getAllType resp', resp?.data);
      if (resp?.data?.status) {
        if (type === '1') {
          // only set categories data if getting it from api
          if (resp?.data?.category) {
            setCourseCategries(
              resp?.data?.category?.filter(el => el.type == '1'),
            );
            setProductCategries(
              resp?.data?.category?.filter(el => el.type == '2'),
            );
          }
          const updatedData = await generateThumb(resp?.data?.data);
          setCourseData(updatedData);
        } else {
          setProductData(resp?.data?.data);
        }
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in getAllType', error);
    }
    setShowLoader(false);
  };
  const generateThumb = async data => {
    // console.log('generateThumb');
    let updatedData = [];
    try {
      updatedData = await Promise.all(
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
    console.log('thumb data SearchAllType', updatedData);
    return updatedData;
  };
  const onLike = async (type, id, status) => {
    setShowLoader(true);
    const formdata = new FormData();
    formdata.append('type', type);
    formdata.append('id', id);
    formdata.append('status', status == '1' ? '0' : '1');
    console.log('onLike formdata', formdata);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.LIKE_OBJECT_TYPE,
        formdata,
      );
      console.log('onLike resp', resp?.data);
      if (resp?.data?.status) {
        Toast.show(resp.data.message, Toast.SHORT);
        getAllType(type);
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in onLike', error);
    }
    setShowLoader(false);
  };

  const changeSelectedTab = id => {
    setSelectedTab(id);
    getAllType(id);
  };

  const openFilterModal = () => {
    setShowFilterModal(true);
  };
  // setOriginalValues will set values for selected filters based on temporary selected filters
  // since we use dont use temporary filter values to show selected filter values on screen
  const setOriginalValues = () => {
    setSelectedTab(temporarySelectedTab);
    setSelectedCourseCategries(tempSelectedCourseCategries);
    setSelectedProductCategries(TempSelectedProductCategries);
    setSelectedPriceFilter(tempSelectedPriceFilter);
    setSelectedRatingValues(tempSelectedRatingValues);
  };
  const applyFilters = async (searchParam = '') => {
    // searchParam is passed to this function because search state takes time to update, and searchParam would reflect latest value of whats typed
    setOriginalValues();
    const postData = new FormData();
    postData.append('type', temporarySelectedTab);
    let catIds = [];
    if (temporarySelectedTab === '1') {
      catIds = courseCategries
        ?.filter(el => tempSelectedCourseCategries?.includes(el?.name))
        ?.map(el => el?.id);
    } else {
      catIds = productCategries
        ?.filter(el => TempSelectedProductCategries?.includes(el?.name))
        ?.map(el => el?.id);
    }
    if (catIds?.length > 0) {
      postData.append('category', catIds[0]);
    }
    if (tempSelectedPriceFilter !== '') {
      postData.append('price', tempSelectedPriceFilter);
    }
    if (tempSelectedRatingValues?.length > 0) {
      tempSelectedRatingValues?.map(el => postData.append('rating[]', el));
    }
    const isSearchTermExists = searchParam?.toString()?.trim()?.length > 0;
    const isSearchValueExists = searchValue?.toString()?.trim()?.length > 0;
    console.log(
      'isSearchTermExists, isSearchValueExists',
      isSearchTermExists,
      isSearchValueExists,
    );
    console.log('searchTerm', searchParam);
    console.log('searchValue', searchValue);
    if (isSearchTermExists || isSearchValueExists) {
      // handling special case: while deleting last character of search, since search state would not update fast, so using searchParam instead of search state (searchValue)
      if (
        searchValue?.toString()?.trim()?.length === 1 &&
        searchParam?.toString()?.trim()?.length === 0
      ) {
        postData.append('title', searchParam?.toString()?.trim());
      } else {
        // preferring to check searchParam first, because it has the most recent search value fast. But it is not always passed, in else case using searchValue
        if (isSearchTermExists) {
          postData.append('title', searchParam?.toString()?.trim());
        } else {
          postData.append('title', searchValue?.toString()?.trim());
        }
      }
    }
    console.log('applyFilters postData', JSON.stringify(postData));
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.ALL_TYPE_LISTING,
        postData,
      );
      console.log('applyFilters resp', resp?.data);
      if (resp?.data?.status) {
        if (temporarySelectedTab !== selectedTab) {
          setSelectedTab(temporarySelectedTab);
        }
        setShowFilterModal(false);
        if (temporarySelectedTab === '1') {
          const updatedData = await generateThumb(resp?.data?.data);
          setCourseData(updatedData);
        } else {
          setProductData(resp?.data?.data);
        }
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in applyFilters', error);
    }
    setShowLoader(false);
  };
  const resetFilter = async () => {
    setShowFilterModal(false);
    // emptying all filter states and calling getAllType
    setSearchValue('')
    setSelectedTab('1');
    setTemporarySelectedTab('1');
    setSelectedCourseCategries([]);
    setTempSelectedCourseCategries([]);
    setSelectedProductCategries([]);
    setTempSelectedProductCategries([]);
    setSelectedPriceFilter('');
    setTempSelectedPriceFilter('');
    setSelectedRatingValues([]);
    setTempSelectedRatingValues([]);
    await getAllType();
  };
  const removeFilter = async (filterType, item) => {
    let remainingSelectedCategories =
      selectedTab === '1'
        ? selectedCourseCategries
        : TempSelectedProductCategries;
    console.log('selectedCourseCategries', selectedCourseCategries, item);
    if (filterType === 'cat') {
      if (selectedTab === '1') {
        remainingSelectedCategories = selectedCourseCategries?.filter(
          el => el !== item,
        );
        setSelectedCourseCategries([...remainingSelectedCategories]);
        setTempSelectedCourseCategries([...remainingSelectedCategories]);
      } else {
        remainingSelectedCategories = TempSelectedProductCategries?.filter(
          el => el !== item,
        );
        setSelectedProductCategries([...remainingSelectedCategories]);
        setTempSelectedProductCategries([...remainingSelectedCategories]);
      }
    }
    const remainingPriceFilter = '';
    if (filterType === 'price') {
      setTempSelectedPriceFilter('');
      setSelectedPriceFilter('');
    }
    let remainingselectedRatingValues = [...selectedRatingValues];
    if (filterType === 'rating') {
      remainingselectedRatingValues = selectedRatingValues?.filter(
        el => el !== item,
      );
      setSelectedRatingValues(remainingselectedRatingValues);
      setTempSelectedRatingValues(remainingselectedRatingValues);
    }
    selectedRatingValues;
    // priceFilterValues?.find(el => el.id === selectedPriceFilter);
    const postData = new FormData();
    postData.append('type', temporarySelectedTab);
    let catIds = [];
    if (temporarySelectedTab === '1') {
      catIds = courseCategries
        ?.filter(el => remainingSelectedCategories?.includes(el?.name))
        ?.map(el => el?.id);
    } else {
      catIds = productCategries
        ?.filter(el => remainingSelectedCategories?.includes(el?.name))
        ?.map(el => el?.id);
    }
    if (catIds?.length > 0) {
      postData.append('category', catIds[0]);
    }
    if (remainingPriceFilter !== '') {
      postData.append('price', tempSelectedPriceFilter);
    }
    if (remainingselectedRatingValues?.length > 0) {
      remainingselectedRatingValues?.map(el => postData.append('rating[]', el));
    }
    console.log('removeFilter postData', JSON.stringify(postData));
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.ALL_TYPE_LISTING,
        postData,
      );
      console.log('removeFilter resp', resp?.data);
      if (resp?.data?.status) {
        if (temporarySelectedTab !== selectedTab) {
          setSelectedTab(temporarySelectedTab);
        }
        setShowFilterModal(false);
        if (temporarySelectedTab === '1') {
          const updatedData = await generateThumb(resp?.data?.data);
          setCourseData(updatedData);
        } else {
          setProductData(resp?.data?.data);
        }
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in removeFilter', error);
    }
    setShowLoader(false);
  };

  const renderCourse = ({item}) => {
    return (
      <View style={styles.courseContainer}>
        <ImageBackground
          // source={item.courseImg}
          source={{uri: item?.thumb?.path}}
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
                text={item.avg_rating}
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
                text={item?.content_creator_name}
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
              <TouchableOpacity
                onPress={() => {
                  onLike('1', item.id, item.isLike);
                }}>
                <Image
                  source={
                    item.isLike
                      ? require('assets/images/heart-selected.png')
                      : require('assets/images/heart-yellow-outline.png')
                  }
                  style={{width: 14, height: 14}}
                />
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
    console.log('wishlist item.Product_image', item.Product_image);
    return (
      <View style={styles.courseContainer}>
        <ImageBackground
          source={{uri: item.Product_image[0]}}
          style={styles.crseImg}>
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
                text={item?.creator_name}
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
              <TouchableOpacity
                onPress={() => {
                  onLike('2', item.id, item.isLike);
                }}>
                <Image
                  source={
                    item.isLike
                      ? require('assets/images/heart-selected.png')
                      : require('assets/images/heart-yellow-outline.png')
                  }
                  style={{width: 14, height: 14}}
                />
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
  const ShowSelectedFilters = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
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
                  <TouchableOpacity onPress={() => removeFilter('cat', el)}>
                    <Image source={require('assets/images/trash.png')} />
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
                  <TouchableOpacity onPress={() => removeFilter('cat', el)}>
                    <Image source={require('assets/images/trash.png')} />
                  </TouchableOpacity>
                </View>
              ))}
        </View>
        {selectedPriceFilter !== '' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 10,
            }}>
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
              onPress={() => removeFilter('price', selectedPriceFilter)}>
              <Image source={require('assets/images/trash.png')} />
            </TouchableOpacity>
          </View>
        ) : null}
        {selectedRatingValues?.length > 0
          ? selectedRatingValues?.map((el, index) => (
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
                <TouchableOpacity onPress={() => removeFilter('rating', el)}>
                  <Image source={require('assets/images/trash.png')} />
                </TouchableOpacity>
              </View>
            ))
          : null}
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
          <SearchWithIcon
            placeholder="Search by title"
            value={searchValue}
            onChangeText={e => {
              console.log('SearchWithIcon', e);
              setSearchValue(e);
              applyFilters(e);
            }}
            style={{marginTop: 10}}
          />
          <TouchableOpacity onPress={openFilterModal}>
            <MyText
              text={'Filter'}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
            />
          </TouchableOpacity>
          <ShowSelectedFilters />
          {selectedTab === '1' ? (
            <FlatList
              // data={courseList}
              data={courseData}
              style={{marginTop: 28}}
              keyExtractor={(_, index) => index.toString()}
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
        <FiltersModal
          visible={showFilterModal}
          setVisibility={setShowFilterModal}
          tabs={tabs}
          courseCategries={courseCategries}
          productCategries={productCategries}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          temporarySelectedTab={temporarySelectedTab}
          setTemporarySelectedTab={setTemporarySelectedTab}
          tempSelectedCourseCategries={tempSelectedCourseCategries}
          setTempSelectedCourseCategries={setTempSelectedCourseCategries}
          TempSelectedProductCategries={TempSelectedProductCategries}
          setTempSelectedProductCategries={setTempSelectedProductCategries}
          priceFilterValues={priceFilterValues}
          tempSelectedPriceFilter={tempSelectedPriceFilter}
          setTempSelectedPriceFilter={setTempSelectedPriceFilter}
          tempSelectedRatingValues={tempSelectedRatingValues}
          setTempSelectedRatingValues={setTempSelectedRatingValues}
          applyFilters={applyFilters}
          resetFilter={resetFilter}
        />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(SearchAllType);
