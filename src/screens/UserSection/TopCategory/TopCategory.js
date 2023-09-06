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
import {styles} from './TopCategoryStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
// import {WebView} from 'react-native-webview';
import MyButton from '../../../components/MyButton/MyButton';
import SearchWithIcon from '../../../components/SearchWithIcon/SearchWithIcon';

const topCategories = [
  {
    id: '1',
    name: 'Technical Line Tattoo Program',
    img: require('assets/images/technical-line-tattoo-program.png'),
  },
  {
    id: '2',
    name: 'Piercing Program',
    img: require('assets/images/piercing-program.png'),
  },
  {
    id: '3',
    name: 'Tattoo Removal',
    img: require('assets/images/tattoo-removal.png'),
  },
  {
    id: '4',
    name: 'Machine Microblading',
    img: require('assets/images/machine-microblading.png'),
  },
  {
    id: '5',
    name: 'Standard Tattoo Program',
    img: require('assets/images/standard-tattoo-program.png'),
  },
  {
    id: '6',
    name: 'Permanent Lips Training',
    img: require('assets/images/permanent-lips-training.png'),
  },
  {
    id: '7',
    name: 'Permanent Powder',
    img: require('assets/images/permanent-powder.png'),
  },
  {
    id: '8',
    name: 'Permanent Eyeliner Training',
    img: require('assets/images/permanent-eyeliner-training.png'),
  },
];

const TopCategory = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    getCategories();
  }, []);
  const getCategories = async () => {
    setShowLoader(true);
    try {
      const resp = await Service.getApiWithToken(userToken, Service.ALL_CATEGORY);
      console.log('getCategories resp', resp?.data);
      if (resp?.data?.status) {
        setCategoriesData(resp?.data?.data);
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in getCategories', error);
    }
    setShowLoader(false);
  };

  const renderCategory = ({item}) => {
    return (
      <View style={styles.categoryContainer}>
        <Image source={{uri: item.category_image}} style={styles.catImg} />
        <MyText
          text={item.category_name}
          fontFamily="regular"
          fontSize={13}
          textAlign="center"
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
        <MyHeader Title="Top Category" isBackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}
          style={styles.mainView}>
          <SearchWithIcon
            value={searchValue}
            setValue={setSearchValue}
            icon={<Image source={require('assets/images/yellow-seach.png')} />}
            placeholder="Search Category"
            // style={{
            //   width: Constant.width - 40,
            //   alignSelf: 'center',
            //   marginTop: -25,
            // }}
          />
          <FlatList
            data={categoriesData}
            numColumns={3}
            style={{marginTop: 37}}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderCategory}
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
export default connect(null, mapDispatchToProps)(TopCategory);
