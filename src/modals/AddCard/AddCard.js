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
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
//import : custom components
import MyText from 'components/MyText/MyText';
//import : globals
import {Colors, Constant, MyIcon, ScreenNames} from 'global/Index';
//import : styles
import {styles} from './AddCardStyle';
import Modal from 'react-native-modal';
import MyButton from '../../components/MyButton/MyButton';
import {width} from '../../global/Constant';
import MyTextInput from '../../components/MyTextInput/MyTextInput';
import Toast from 'react-native-simple-toast';

const AddCard = ({visible, setVisibility}) => {
  //variables : navigation
  const [firstCode, setFirstCode] = useState('');
  const [secondCode, setSecondCode] = useState('');
  const [thirdCode, setThirdCode] = useState('');
  const [forthCode, setForthCode] = useState('');
  const [message, setMessage] = useState('');
  const [mm, setMm] = useState('');
  const [yy, setYy] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholdderName, setCardholdderName] = useState('');
  const firstCodeRef = useRef();
  const secondCodeRef = useRef();
  const thirdCodeRef = useRef();
  const forthCodeRef = useRef();
  const mmRef = useRef();
  const yyRef = useRef();
  const [isClickedSSNo, setIsClickedSSNo] = useState(false);
  const [isClickedMMYY, setIsClickedMMYY] = useState(false);
  const navigation = useNavigation();
  //function : navigation function
  //function : modal function
  const closeModal = () => {
    setVisibility(false);
  };
  const addCardValidation = () => {
    if (
      firstCode === '' &&
      secondCode === '' &&
      thirdCode === '' &&
      forthCode === ''
    ) {
      Toast.show('Please enter Card Number', Toast.SHORT);
      return false;
    } else if (
      firstCode?.length < 4 ||
      secondCode?.length < 4 ||
      thirdCode?.length < 4 ||
      forthCode?.length < 4
    ) {
      Toast.show('Please enter complete Card Number', Toast.SHORT);
      return false;
    } else if (mmyy?.trim()?.length < 4) {
      Toast.show('Please enter month and year', Toast.SHORT);
      return false;
    } else if (cardholdderName?.trim()?.length === 0) {
      Toast.show('Please enter Cardholder Name', Toast.SHORT);
      return false;
    }
    return true;
  };
  const onAddCard = async () => {
    if (!addCardValidation()) {
      return;
    }
    const postData = new FormData();
    postData.append(
      'card_number',
      firstCode + secondCode + thirdCode + forthCode,
    );
    postData.append('valid_upto', mmyy);
    postData.append('cvv', cvv);
    postData.append('card_holder_name', cardholdderName);
    setShowLoader(true);
    try {
      const resp = await Service.postApiWithToken(
        userToken,
        Service.ADD_CARD,
        {},
      );
      console.log('onAddCard resp', resp?.data);
    } catch (error) {
      console.log('error in onAddCard', error);
    }
    setShowLoader(false);
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
          text="Add New Card"
          textColor={'black'}
          fontSize={20}
          textAlign="center"
          style={{marginBottom: 20}}
        />
        <View style={styles.flexRowView}>
          {!isClickedSSNo ? (
            <TouchableOpacity
              onPress={() => setIsClickedSSNo(true)}
              style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginVertical: 10,
                paddingHorizontal: 20,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: '#E0E0E0',
                backgroundColor: 'white',
                borderRadius: 5,
                height: 58,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowRadius: 5,
                shadowOpacity: 0.05,
                elevation: 2,
              }}>
              <MyText text={`Card Number`} textColor="#8F93A0" style={{}} />
              <Image source={require('assets/images/card.png')} />
            </TouchableOpacity>
          ) : (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'white',
                  borderRadius: 5,
                  height: 58,
                  width: '100%',
                  marginBottom: 15,
                  paddingHorizontal: 20,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowRadius: 5,
                  shadowOpacity: 0.05,
                  elevation: 2,
                }}>
                <TextInput
                  placeholder="XXXX"
                  ref={firstCodeRef}
                  value={firstCode}
                  onTouchStart={() => (message ? setMessage('') : null)}
                  maxLength={4}
                  keyboardType="number-pad"
                  onChangeText={text => {
                    setFirstCode(text);
                    if (text.length == 4) {
                      secondCodeRef.current.focus();
                    } else {
                      firstCodeRef.current.focus();
                    }
                  }}
                  onSubmitEditing={() => secondCodeRef.current.focus()}
                />
                <TextInput
                  ref={secondCodeRef}
                  value={secondCode}
                  onTouchStart={() => (message ? setMessage('') : null)}
                  placeholder={'XXXX'}
                  // placeholderTextColor={
                  //     secondCode == '' ? Colors.BLACK : Colors.WHITE
                  // }
                  maxLength={4}
                  keyboardType="number-pad"
                  onChangeText={text => {
                    setSecondCode(text);
                    if (text.length == 4) {
                      thirdCodeRef.current.focus();
                    }
                    // else {
                    //     firstCodeRef.current.focus();
                    // }
                  }}
                  onSubmitEditing={() => thirdCodeRef.current.focus()}
                />
                <TextInput
                  ref={thirdCodeRef}
                  value={thirdCode}
                  onTouchStart={() => (message ? setMessage('') : null)}
                  placeholder={'XXXX'}
                  // placeholderTextColor={
                  //     thirdCode == '' ? Colors.BLACK : Colors.WHITE
                  // }
                  maxLength={4}
                  keyboardType="number-pad"
                  onChangeText={text => {
                    setThirdCode(text);
                    if (text.length == 4) {
                      forthCodeRef.current.focus();
                    }
                    // else {
                    //     secondCodeRef.current.focus();
                    // }
                  }}
                  onSubmitEditing={() => forthCodeRef.current.focus()}
                />
                <TextInput
                  ref={forthCodeRef}
                  value={forthCode}
                  onTouchStart={() => (message ? setMessage('') : null)}
                  placeholder={'XXXX'}
                  // placeholderTextColor={
                  //     thirdCode == '' ? Colors.BLACK : Colors.WHITE
                  // }
                  maxLength={4}
                  keyboardType="number-pad"
                  onChangeText={text => {
                    setForthCode(text);
                    if (text.length == 4) {
                      Keyboard.dismiss();
                    }
                    // else {
                    //     secondCodeRef.current.focus();
                    // }
                  }}
                />
                <Image source={require('assets/images/card.png')} />
              </View>
            </>
          )}
        </View>
        <View style={styles.mmyCvvRow}>
          <View style={[styles.flexRowView, {width: '47%'}]}>
            {!isClickedMMYY ? (
              <TouchableOpacity
                onPress={() => setIsClickedMMYY(true)}
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 10,
                  paddingHorizontal: 20,
                  marginBottom: 20,
                  borderWidth: 1,
                  borderColor: '#E0E0E0',
                  backgroundColor: 'white',
                  borderRadius: 5,
                  height: 58,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 3,
                  },
                  shadowRadius: 5,
                  shadowOpacity: 0.05,
                  elevation: 2,
                }}>
                <MyText text={`MM/YY`} textColor="#8F93A0" style={{}} />
                <Image source={require('assets/images/mmyy.png')} />
              </TouchableOpacity>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'white',
                    borderRadius: 5,
                    height: 58,
                    width: '100%',
                    marginBottom: 15,
                    paddingHorizontal: 20,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowRadius: 5,
                    shadowOpacity: 0.05,
                    elevation: 2,
                  }}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TextInput
                      ref={mmRef}
                      value={mm}
                      onChangeText={text => {
                        setMm(text);
                        if (text.length == 2) {
                          yyRef.current.focus();
                        } else {
                          mmRef.current.focus();
                        }
                      }}
                      placeholder={'MM'}
                      // style={{width: '35%'}}
                      iconDefaultPosition="right"
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                    <Text style={{color: Colors.LIGHT_GRAY}}>/</Text>
                    <TextInput
                      ref={yyRef}
                      value={yy}
                      onChangeText={text => {
                        setYy(text);
                        if (text.length == 2) {
                          Keyboard.dismiss();
                        }
                      }}
                      placeholder={'YY'}
                      // style={{width: '35%'}}
                      iconDefaultPosition="right"
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  </View>
                  <Image source={require('assets/images/mmyy.png')} />
                </View>
              </>
            )}
          </View>
          <MyTextInput
            value={cvv}
            setValue={setCvv}
            placeholder={'CVV'}
            style={{width: '47%'}}
            isIcon
            icon={require('assets/images/cvv.png')}
            iconDefaultPosition="right"
            maxLength={2}
          />
        </View>
        <MyTextInput
          value={cardholdderName}
          setValue={setCardholdderName}
          placeholder={'Cardholder Name'}
        />
        <MyButton
          text="ADD"
          style={{
            width: width * 0.9,
            marginBottom: 10,
            backgroundColor: Colors.THEME_BROWN,
          }}
          onPress={closeModal}
        />
      </View>
      {/* </KeyboardAvoidingView> */}
    </Modal>
  );
};

export default AddCard;
