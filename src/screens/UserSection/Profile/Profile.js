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
  KeyboardAvoidingView,
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
import {styles} from './ProfileStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
// import {WebView} from 'react-native-webview';
import MyButton from '../../../components/MyButton/MyButton';
import MyTextInput from '../../../components/MyTextInput/MyTextInput';
import ProfileTab from './components/ProfileTab/ProfileTab';
import PasswordTab from './components/PasswordTab/PasswordTab';
import CertificateTab from './components/CertificateTab/CertificateTab';
import NotificationsTab from './components/NotificationsTab/NotificationsTab';
import BillingTab from './components/BillingTab/BillingTab';
import AddCard from '../../../modals/AddCard/AddCard';
import OrderHistoryTab from './components/OrderHistoryTab/OrderHistoryTab';
import OrderStatus from '../../../modals/OrderStatus/OrderStatus';

const personImg = `https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFufGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=60`;

const Profile = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedTab, setSelectedTab] = useState('1');
  const [tabs, setTabs] = useState([
    {
      id: '1',
      name: 'Profile',
    },
    {
      id: '2',
      name: 'Password',
    },
    {
      id: '3',
      name: 'Certificates',
    },
    {
      id: '4',
      name: 'Notifications',
    },
    {
      id: '5',
      name: 'Billing',
    },
    {
      id: '6',
      name: 'Order History',
    },
  ]);
  // profile tab states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [timezone, setTimezone] = useState('');

  // password tab states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // certificate tab states
  const [certificateList, setCertificateList] = useState([
    {
      id: '1',
      creatorName: `Max Bryrant`,
      certificateImg: require('assets/images/certificate-image.png'),
      certificateName: 'Tattoo Cover-Ups & Transformations',
      certificateRating: '4.7',
      certificateFee: '399.00',
      status: 'Completed',
      onView: () => {},
      onDownload: () => {},
    },
    {
      id: '2',
      creatorName: `Max Bryrant`,
      certificateImg: require('assets/images/certificate-image.png'),
      certificateName: 'Tattoo Cover-Ups & Transformations',
      certificateRating: '4.7',
      certificateFee: '399.00',
      status: 'Ongoing',
      onView: () => {},
      onDownload: () => {},
    },
  ]);
  const [orderHistoryData, setOrderHistoryData] = useState([
    {
      id: '1',
      creatorName: `Max Bryrant`,
      courseImg: require('assets/images/prod-img-1.png'),
      courseName: `O'Reilly's tattoo machine Motor`,
      courseRating: '4.7',
      courseFee: '399.00',
      status: 'Picked-up',
      orderId: 'HBD898DMND8333',
      date: '26 Juny 2023 9:30AM',
      ago: '10h ago',
    },
    {
      id: '2',
      creatorName: `Nikhil Sam`,
      courseImg: require('assets/images/prod-img-2.png'),
      courseName: `O'Reilly's tattoo machine Motor`,
      courseRating: '4.7',
      courseFee: '399.00',
      status: 'Packed',
      orderId: 'HBD898DMND8333',
      courseCompletedDate: '26 Juny 2023 9:30AM',
      ago: '10h ago',
      date: '26 Juny 2023 9:30AM',
    },
  ]);
  // notifications tab states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  // billing tab states
  const [cardList, setCardList] = useState([]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showOrderStatusModal, setShowOrderStatusModal] = useState(false);

  // profile tab refs
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const companyRef = useRef(null);
  const professionalTitleRef = useRef(null);
  const timezoneRef = useRef(null);
  // password tab refs
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  useEffect(() => {
    console.log('userToken', userToken);
    getProfileData();
  }, []);
  const getProfileData = async (id = '1') => {
    const endPoint = getEndpoint(id)
    console.log('endPoint', endPoint);
    setShowLoader(true);
    try {
      const resp = await Service.getApiWithToken(userToken, endPoint);
      console.log('getProfileData resp', resp?.data);
      if (resp?.data?.status) {
        if(id === '1'){
          setProfileTabData(resp?.data?.data)
        } else if(id === '3'){
          setCertificatesTabData(resp?.data?.data)
        } else if(id === '4'){
          setNotificationsTabData(resp?.data?.data)
        } else if(id === '5'){
          setBillingTabData(resp?.data?.data)
        }
      } else {
        Toast.show(resp.data.message, Toast.SHORT);
      }
    } catch (error) {
      console.log('error in getProfileData', error);
    }
    setShowLoader(false);
  };
  const setProfileTabData = (data) => {
    setFirstName(data?.first_name)
    setLastName(data?.last_name)
    setEmail(data?.email)
    setCompany(data?.company)
    setProfessionalTitle(data?.professional_title)
    setTimezone(data?.timezone)
  }
  const setCertificatesTabData = (data) => {}
  const setNotificationsTabData = (data) => {}
  const setBillingTabData = (data) => {
    setCardList(data)
  }

  const openAddCardModal = () => {
    setShowAddCardModal(true);
  };
  const viewDetails = () => {
    setShowOrderStatusModal(true);
  };

  const deleteCard = id => {
    const cardListCopy = [...cardList];
    const updatedData = cardListCopy.filter(el => el.id !== id);
    setCardList([...updatedData]);
    // setSelectedCard(id);
  };

  const changeSelectedTab = id => {
    setSelectedTab(id);
    if(id !== '2'){
      getProfileData(id)
    }
  };

  const renderTab = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => changeSelectedTab(item.id)}
        style={[
          styles.tab,
          selectedTab === item.id
            ? {backgroundColor: Colors.THEME_BROWN}
            : null,
        ]}>
        <MyText
          text={item.name}
          fontFamily="regular"
          fontSize={13}
          textColor={
            selectedTab === item.id ? Colors.THEME_GOLD : Colors.THEME_BROWN
          }
        />
      </TouchableOpacity>
    );
  };

  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: '20%'}}
            style={styles.mainView}>
            <View style={styles.contactContainer}>
              <Image source={{uri: personImg}} style={styles.personImg} />
              <View style={{marginLeft: 17}}>
                <MyText
                  text={'Katy Perry'}
                  fontFamily="bold"
                  fontSize={18}
                  textColor={Colors.THEME_GOLD}
                />
                <View style={styles.contactRow}>
                  <Image source={require('assets/images/email-profile.png')} />
                  <MyText
                    text={'Katty@gmail.com'}
                    fontFamily="regular"
                    fontSize={14}
                    textColor={Colors.LIGHT_GREY}
                    style={{marginLeft: 10}}
                  />
                </View>
                <View style={styles.contactRow}>
                  <Image source={require('assets/images/phone-profile.png')} />
                  <MyText
                    text={'+91-7859525710'}
                    fontFamily="regular"
                    fontSize={14}
                    textColor={Colors.LIGHT_GREY}
                    style={{marginLeft: 10}}
                  />
                </View>
              </View>
            </View>

            <FlatList
              data={tabs}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{marginTop: 19}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderTab}
            />
            {selectedTab === '1' ? (
              <ProfileTab
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                company={company}
                setCompany={setCompany}
                professionalTitle={professionalTitle}
                setProfessionalTitle={setProfessionalTitle}
                timezone={timezone}
                setTimezone={setTimezone}
                lastNameRef={lastNameRef}
                emailRef={emailRef}
                companyRef={companyRef}
                professionalTitleRef={professionalTitleRef}
                timezoneRef={timezoneRef}
              />
            ) : selectedTab === '2' ? (
              <PasswordTab
                oldPassword={oldPassword}
                setOldPassword={setOldPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                newPasswordRef={newPasswordRef}
                confirmPasswordRef={confirmPasswordRef}
              />
            ) : selectedTab == '3' ? (
              <CertificateTab certificateList={certificateList} />
            ) : selectedTab == '4' ? (
              <NotificationsTab
                notificationsEnabled={notificationsEnabled}
                setNotificationsEnabled={setNotificationsEnabled}
              />
            ) : selectedTab == '5' ? (
              <BillingTab
                cardList={cardList}
                deleteCard={deleteCard}
                openAddCardModal={openAddCardModal}
              />
            ) : selectedTab == '6' ? (
              <OrderHistoryTab
                orderHistoryData={orderHistoryData}
                viewDetails={viewDetails}
              />
            ) : null}
          </ScrollView>
        </KeyboardAvoidingView>
        <CustomLoader showLoader={showLoader} />
        <AddCard
          visible={showAddCardModal}
          setVisibility={setShowAddCardModal}
          setShowLoader={setShowLoader}
          userToken={userToken}
          getProfileData={getProfileData}
        />
        <OrderStatus
          visible={showOrderStatusModal}
          setVisibility={setShowOrderStatusModal}
        />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(Profile);

const getEndpoint = (id) => {
  let endPoint = ''
    if(id === '1'){
      endPoint = Service.PROFILE
    } else if(id === '3'){
      endPoint = Service.CERTIFICATES
    } else if(id === '4'){
      endPoint = Service.NOTIFICATIONS
    } else if(id === '5'){
      endPoint = Service.SAVE_CARD_LISTING
    }
    return endPoint
}