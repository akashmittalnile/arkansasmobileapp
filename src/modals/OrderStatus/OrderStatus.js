//import : react components
import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
//import : custom components
import MyText from 'components/MyText/MyText';
//import : globals
import {Colors, Constant, MyIcon, ScreenNames} from 'global/Index';
//import : styles
import {styles} from './OrderStatusStyle';
import Modal from 'react-native-modal';
import MyButton from '../../components/MyButton/MyButton';
import {width} from '../../global/Constant';

const OrderStatus = ({visible, setVisibility}) => {
  //variables : navigation
  const data = {
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
  };
  const orderStatusData = [
    {
      name: 'Order Placed',
      date: '26 May 2023, 09:30 PM',
      isComplete: true,
    },
    {
      name: 'Packed',
      date: '26 May 2023, 09:30 PM',
      isComplete: true,
    },
    {
      name: 'Pickup',
      date: '26 May 2023, 09:30 PM',
      isComplete: false,
    },
  ];
  const navigation = useNavigation();
  //function : navigation function
  //function : modal function
  const closeModal = () => {
    setVisibility(false);
  };
  //UI
  return (
    <Modal
      isVisible={visible}
      swipeDirection="down"
      onBackdropPress={() => setVisibility(false)}
      onSwipeComplete={e => {
        setVisibility(false);
      }}
      scrollTo={() => {}}
      scrollOffset={1}
      propagateSwipe={true}
      coverScreen={false}
      backdropColor="transparent"
      style={styles.modal}>
      {/* <KeyboardAvoidingView
        style={{}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
      <View style={styles.modalContent}>
        <MyText
          text={'Order Status'}
          fontFamily="regular"
          fontSize={20}
          textAlign="center"
          textColor={'black'}
          style={{}}
        />
        <View style={styles.orderIdRow}>
          <MyText
            text={`Order ID:`}
            fontFamily="medium"
            fontSize={14}
            textColor={Colors.LIGHT_GREY}
            style={{}}
          />
          <MyText
            text={data.orderId}
            fontFamily="medium"
            fontSize={14}
            textColor={Colors.THEME_GOLD}
            style={{}}
          />
        </View>
        <MyText
          text={`Show this order ID to pick from centre`}
          fontFamily="regular"
          fontSize={12}
          textColor={Colors.LIGHT_GREY}
          style={{}}
        />
        <View style={styles.courseContainer}>
          <View style={styles.courseSubContainer}>
            <ImageBackground source={data.courseImg} style={styles.crseImg}>
              {/* <TouchableOpacity>
            <Image source={require('assets/images/play-icon.png')} />
          </TouchableOpacity> */}
            </ImageBackground>
            <View style={{marginLeft: 11, width: width * 0.5}}>
              <MyText
                text={data.courseName}
                fontFamily="regular"
                fontSize={13}
                textColor={Colors.LIGHT_GREY}
                style={{}}
              />
              <View style={styles.middleRow}>
                <View style={styles.ratingRow}>
                  <Image source={require('assets/images/star.png')} />
                  <MyText
                    text={data.courseRating}
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
                    text={data.creatorName}
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
                  text={'$' + data.courseFee}
                  fontFamily="bold"
                  fontSize={14}
                  textColor={Colors.THEME_GOLD}
                  letterSpacing={0.14}
                  style={{}}
                />
              </View>
            </View>
          </View>
        </View>

        {/* order statuses */}
        <View style={{marginTop: 20}}>
          <View style={styles.row}>
            <Image source={require('assets/images/status-tick-complete.png')} />
            <View style={{marginLeft: 13}}>
              <MyText
                text={'Order Placed'}
                fontFamily="medium"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                style={{}}
              />
              <MyText
                text={'26 May, 2023; 09:30AM'}
                fontFamily="regular"
                fontSize={12}
                textColor={Colors.LIGHT_GREY}
                style={{}}
              />
            </View>
          </View>
          <View style={{marginTop: 7, marginLeft: 9}}>
            {[...Array(5).keys()]?.map(el => (
              <View style={styles.brownDot}></View>
            ))}
          </View>
          <View style={[styles.row, {marginTop: -5}]}>
            <Image source={require('assets/images/status-tick-complete.png')} />
            <View style={{marginLeft: 13}}>
              <MyText
                text={'Packed'}
                fontFamily="medium"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                style={{}}
              />
              <MyText
                text={'23/A - Airport -London'}
                fontFamily="regular"
                fontSize={12}
                textColor={Colors.LIGHT_GREY}
                style={{}}
              />
              <MyText
                text={'26 May, 2023; 09:30AM'}
                fontFamily="regular"
                fontSize={12}
                textColor={Colors.LIGHT_GREY}
                style={{}}
              />
            </View>
          </View>
          <View style={{marginTop: 3, marginLeft: 9}}>
            {[...Array(5).keys()]?.map(el => (
              <View style={styles.greyDot}></View>
            ))}
          </View>
          <View style={[styles.row, {marginTop: 3}]}>
            <View style={styles.imcompleteDot}></View>
            <View style={{marginLeft: 13}}>
              <MyText
                text={'Pickup'}
                fontFamily="medium"
                fontSize={14}
                textColor={Colors.THEME_GOLD}
                style={{}}
              />
              <MyText
                text={'26 May, 2023; 09:30AM'}
                fontFamily="regular"
                fontSize={12}
                textColor={Colors.LIGHT_GREY}
                style={{}}
              />
            </View>
          </View>
        </View>

        <MyButton
          text="Close"
          style={{
            width: width * 0.9,
            marginBottom: 10,
            marginTop: 27,
            backgroundColor: Colors.THEME_BROWN,
          }}
          onPress={closeModal}
        />
      </View>
      {/* </KeyboardAvoidingView> */}
    </Modal>
  );
};

export default OrderStatus;
