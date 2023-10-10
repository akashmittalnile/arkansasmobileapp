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
import {styles} from './SuggestedProductsStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
// import {WebView} from 'react-native-webview';
import MyButton from '../../../components/MyButton/MyButton';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';
import SuggestedProductsFiltersModal from './components/SuggestedProductsFiltersModal/SuggestedProductsFiltersModal';

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

const SuggestedProducts = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [productData, setProductData] = useState([]);
  const [selectedProductCategries, setSelectedProductCategries] = useState([]);
  const [productCategries, setProductCategries] = useState([]);
  const [TempSelectedProductCategries, setTempSelectedProductCategries] =
    useState([]);
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
  const [showFilterModal, setShowFilterModal] = useState(false);

  useEffect(() => {
    getSuggestedProducts();
  }, []);
  const getSuggestedProducts = async () => {
    const postData = new FormData();
    postData.append('type', 2);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.SUGGESTED_LIST,
        postData,
      );
      console.log('getSuggestedProducts resp', resp?.data);
      if (resp?.data?.status) {
        setProductData(resp?.data?.data);
        if (resp?.data?.category) {
          setProductCategries(
            resp?.data?.category
              ?.filter(el => el.type == '2')
              ?.map(el => ({id: el?.id, name: el?.category_name})),
          );
        }
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in getSuggestedProducts', error);
    }
    setShowLoader(false);
  };

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
        Toast.show(resp.data.message, Toast.SHORT);
        getSuggestedProducts();
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in onLike', error);
    }
    setShowLoader(false);
  };

  const renderProduct = ({item}) => {
    return (
      <View style={styles.courseContainer}>
        <ImageBackground
          source={{uri: item?.Product_image[0]}}
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
                text={item?.avg_rating}
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
            <View style={styles.iconsRow}>
              <TouchableOpacity
                onPress={() => {
                  onLike('2', item.id, item?.isWishlist);
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
        </View>
      </View>
    );
  };
  const openFilterModal = () => {
    setShowFilterModal(true);
  };
  // setOriginalValues will set values for selected filters based on temporary selected filters
  // since we use dont use temporary filter values to show selected filter values on screen
  const setOriginalValues = () => {
    setSelectedProductCategries(TempSelectedProductCategries);
    setSelectedPriceFilter(tempSelectedPriceFilter);
    setSelectedRatingValues(tempSelectedRatingValues);
  };
  const setOriginalValues2 = () => {
    setSelectedProductCategries(TempSelectedProductCategries);
    setSelectedPriceFilter(tempSelectedPriceFilter);
    setSelectedRatingValues(tempSelectedRatingValues);
  };
  const applyFilters = async (searchParam = '') => {
    setOriginalValues();
    const postData = new FormData();
    postData.append('type', 2);
    let catIds = [];
    catIds = productCategries
      ?.filter(el => TempSelectedProductCategries?.includes(el?.name))
      ?.map(el => el?.id);
    if (catIds?.length > 0) {
      catIds?.map(el => postData.append('category[]', el));
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
        Service.SUGGESTED_LIST,
        postData,
      );
      console.log('applyFilters resp', resp?.data);
      if (resp?.data?.status) {
        setShowFilterModal(false);
        setProductData(resp?.data?.data);
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in applyFilters', error);
    }
    setShowLoader(false);
  };
  const applyFilters2 = async (searchParam = '') => {
    const isDeletingLastCharacterInSearch =
      searchValue?.toString()?.trim()?.length === 1 &&
      searchParam?.toString()?.trim()?.length === 0;
    const isSearching = isDeletingLastCharacterInSearch || searchParam !== '';
    setOriginalValues2();
    const postData = new FormData();
    postData.append('type', 2);
    let catIds = [];
    catIds = productCategries
      ?.filter(el => TempSelectedProductCategries?.includes(el?.name))
      ?.map(el => el?.id);
    if (catIds?.length > 0) {
      catIds?.map(el => postData.append('category[]', el));
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
        Service.SUGGESTED_LIST,
        postData,
      );
      console.log('applyFilters resp', resp?.data);
      if (resp?.data?.status) {
        setShowFilterModal(false);
        setProductData(resp?.data?.data);
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
    setSearchValue('');
    setSelectedProductCategries([]);
    setTempSelectedProductCategries([]);
    setSelectedPriceFilter('');
    setTempSelectedPriceFilter('');
    setSelectedRatingValues([]);
    setTempSelectedRatingValues([]);
    await getSuggestedProducts();
  };
  const removeFilter = async (filterType, item) => {
    let remainingSelectedCategories = [...TempSelectedProductCategries];
    if (filterType === 'cat') {
      remainingSelectedCategories = TempSelectedProductCategries?.filter(
        el => el !== item,
      );
      setSelectedProductCategries([...remainingSelectedCategories]);
      setTempSelectedProductCategries([...remainingSelectedCategories]);
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
    postData.append('type', 2);
    let catIds = [];
    catIds = productCategries
      ?.filter(el => remainingSelectedCategories?.includes(el?.name))
      ?.map(el => el?.id);
    if (catIds?.length > 0) {
      catIds?.map(el => postData.append('category[]', el));
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
        Service.SUGGESTED_LIST,
        postData,
      );
      console.log('removeFilter resp', resp?.data);
      if (resp?.data?.status) {
        setShowFilterModal(false);
        setProductData(resp?.data?.data);
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in removeFilter', error);
    }
    setShowLoader(false);
  };
  const ShowSelectedFilters = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}>
        {selectedProductCategries?.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              backgroundColor: '#ede5ca',
              marginRight: 'auto',
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
            }}>
            <MyText
              text={'Categorie(s): '}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{}}
            />
            {selectedProductCategries?.map((el, index) => (
              <View
                key={index?.toString()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 10,
                  marginTop: 10,
                }}>
                <MyText
                  key={el}
                  text={el}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.THEME_BROWN}
                />
                <TouchableOpacity
                  onPress={() => removeFilter('cat', el)}
                  style={{marginLeft: 5, marginTop: 3}}>
                  <Image
                    source={require('assets/images/cancelfilter.png')}
                    style={{height: 10, width: 10}}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : null}
        {selectedPriceFilter !== '' ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#ede5ca',
              marginRight: 'auto',
              marginTop: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
            }}>
            <MyText
              text={'Price: '}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{}}
            />
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
              onPress={() => removeFilter('price', selectedPriceFilter)}
              style={{marginLeft: 5, marginTop: 3}}>
              <Image
                source={require('assets/images/cancelfilter.png')}
                style={{height: 10, width: 10}}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        {selectedRatingValues?.length > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              backgroundColor: '#ede5ca',
              marginRight: 'auto',
              marginTop: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 10,
            }}>
            <MyText
              text={'Rating: '}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.THEME_BROWN}
              style={{}}
            />
            {selectedRatingValues?.map((el, index) => (
              <View
                key={index?.toString()}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 10,
                  marginTop: 10,
                }}>
                <MyText
                  key={el}
                  text={`${el} and more`}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.THEME_BROWN}
                />
                <TouchableOpacity
                  onPress={() => removeFilter('rating', el)}
                  style={{
                    marginLeft: 5,
                    marginTop: 3,
                  }}>
                  <Image
                    source={require('assets/images/cancelfilter.png')}
                    style={{height: 10, width: 10}}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    );
  };
  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Suggested Products" isBackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          style={styles.mainView}>
          <SearchWithIcon
            value={searchValue}
            setValue={setSearchValue}
            placeholder="Search by title"
            onChangeText={e => {
              console.log('SearchWithIcon', e);
              setSearchValue(e);
              applyFilters2(e);
            }}
            onPress={openFilterModal}
            icon={<Image source={require('assets/images/filter.png')} />}
            style={{marginTop: 10}}
          />
          <ShowSelectedFilters />
          {productData?.length > 0 ? (
            <FlatList
              data={productData || []}
              style={{marginTop: 28}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderProduct}
            />
          ) : (
            <View style={{alignItems: 'center', marginTop: 50}}>
              <Image source={require('assets/images/no-data.png')} />
              <MyText
                text={'No Products found'}
                fontFamily="medium"
                fontSize={40}
                textAlign="center"
                textColor={'black'}
              />
            </View>
          )}
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
        <SuggestedProductsFiltersModal
          visible={showFilterModal}
          setVisibility={setShowFilterModal}
          productCategries={productCategries}
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
export default connect(null, mapDispatchToProps)(SuggestedProducts);
