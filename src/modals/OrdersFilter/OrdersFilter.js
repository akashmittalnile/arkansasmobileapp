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
  ScrollView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
//import : custom components
import MyText from 'components/MyText/MyText';
//import : globals
import {Colors, Constant, MyIcon, ScreenNames} from 'global/Index';
//import : styles
import {styles} from './OrdersFilterStyle';
import Modal from 'react-native-modal';
import MyButton from '../../components/MyButton/MyButton';
import {width} from '../../global/Constant';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

const sliderRadius = 3;
const someWidth = 50;

const OrdersFilter = ({
  visible,
  setVisibility,
  onClearFilter,
  onApplyFilter,
  orderTypes,
  subjects,
  dateUploaded,
  changeOrderTypes,
  changeSubjects,
  changeDateUploaded,
  selectedOrderType,
  selectedSubject,
  selectedDateUploaded,
  multiSliderValue,
  multiSliderValuesChange,
}) => {
  //variables : navigation
  const navigation = useNavigation();
  //function : navigation function
  //function : modal function
  const closeModal = () => {
    setVisibility(false);
  };
  const CustomLabel = props => {
    console.log('props', props);
    return (
      <View style={{position: 'relative'}}>
        <TouchableOpacity
          onPress={props.oneMarkerPressed}
          style={{
            left:
              props.oneMarkerLeftPosition - someWidth / 2 + sliderRadius + 15,
            position: 'absolute',
            bottom: -60,
            minWidth: someWidth,
          }}>
          <MyText
            text={`$${props.oneMarkerValue}`}
            textColor={Colors.LIGHT_GREY}
            fontSize={12}
            fontFamily="medium"
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={props.oneMarkerPressed}
          style={{
            left:
              props.twoMarkerLeftPosition - someWidth / 2 + sliderRadius - 2,
            position: 'absolute',
            bottom: -60,
            minWidth: someWidth,
          }}>
          <MyText
            text={`$${props.twoMarkerValue}`}
            textColor={Colors.LIGHT_GREY}
            fontSize={12}
            fontFamily="medium"
          />
        </TouchableOpacity>
      </View>
    );
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
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}> */}
      <View style={styles.modalContent}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%'}}>
          <View style={styles.header}>
            <TouchableOpacity onPress={closeModal}>
              <Image source={require('assets/images/arrow-left-black.png')} />
            </TouchableOpacity>
            <MyText
              text="Filters"
              textColor={Colors.DARK_GREY}
              fontSize={16}
              fontFamily="medium"
              style={{position: 'absolute', left: '45%'}}
            />
          </View>
          <MyText
            text="Choose Order Type"
            textColor={Colors.DARK_GREY}
            fontSize={16}
            fontFamily="medium"
            style={{marginTop: 47, marginBottom: 14}}
          />
          <View style={styles.row}>
            {orderTypes?.map((item, index) => (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => {
                  changeOrderTypes(item.id);
                }}>
                <View
                  style={[
                    styles.row,
                    index === 1 || index === 2 ? {marginLeft: 30} : null,
                  ]}>
                  <Image
                    source={
                      selectedOrderType === item.id
                        ? require('assets/images/selected-2.png')
                        : require('assets/images/not-selected.png')
                    }
                    style={{height: 22, width: 22}}
                  />
                  <MyText
                    text={item.name}
                    textColor={Colors.DARK_GREY}
                    fontSize={16}
                    fontFamily="medium"
                    style={{marginLeft: 10}}
                  />
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
          <MyText
            text="Subject"
            textColor={Colors.DARK_GREY}
            fontSize={16}
            fontFamily="medium"
            style={{marginTop: 47, marginBottom: 14}}
          />
          <View style={{}}>
            {subjects?.map((item, index) => (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => {
                  changeSubjects(item.id);
                }}>
                <View style={[styles.row, {marginBottom: 12}]}>
                  <Image
                    source={
                      selectedSubject === item.id
                        ? require('assets/images/selected-2.png')
                        : require('assets/images/not-selected.png')
                    }
                    style={{height: 22, width: 22}}
                  />
                  <MyText
                    text={item.name}
                    textColor={Colors.DARK_GREY}
                    fontSize={16}
                    fontFamily="medium"
                    style={{marginLeft: 10}}
                  />
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
          <MyText
            text="Date Uploaded"
            textColor={Colors.DARK_GREY}
            fontSize={16}
            fontFamily="medium"
            style={{marginTop: 35, marginBottom: 14}}
          />
          <View style={styles.row}>
            {dateUploaded?.map((item, index) => (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => {
                  changeDateUploaded(item.id);
                }}>
                <View
                  style={[
                    styles.row,
                    index === 1 || index === 2 ? {marginLeft: 30} : null,
                  ]}>
                  <Image
                    source={
                      selectedDateUploaded === item.id
                        ? require('assets/images/selected-2.png')
                        : require('assets/images/not-selected.png')
                    }
                    style={{height: 22, width: 22}}
                  />
                  <MyText
                    text={item.name}
                    textColor={Colors.DARK_GREY}
                    fontSize={16}
                    fontFamily="medium"
                    style={{marginLeft: 10}}
                  />
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
          <MyText
            text="Price"
            textColor={Colors.DARK_GREY}
            fontSize={16}
            fontFamily="medium"
            style={{marginTop: 35, marginBottom: 5}}
          />
          <View style={{paddingHorizontal: 15}}>
            <MultiSlider
              values={[multiSliderValue[0], multiSliderValue[1]]}
              // values={[multiSliderValue[0]]}
              sliderLength={320}
              onValuesChange={multiSliderValuesChange}
              min={0}
              max={10000}
              step={1}
              // markerOffsetX={12}
              // markerOffsetY={10}
              enableLabel
              customLabel={props => <CustomLabel {...props} />}
              allowOverlap={false}
              minMarkerOverlapDistance={10}
              markerStyle={{
                ...Platform.select({
                  ios: {
                    height: 25,
                    width: 25,
                    shadowColor: '#000000',
                    shadowOffset: {
                      width: 0,
                      height: 3,
                    },
                    shadowRadius: 1,
                    shadowOpacity: 0.1,
                    borderColor: Colors.THEME_GOLD,
                    borderWidth: 1,
                  },
                  android: {
                    height: 25,
                    width: 25,
                    borderRadius: 50,
                    backgroundColor: Colors.THEME_GOLD,
                    borderColor: Colors.THEME_GOLD,
                    borderWidth: 1,
                  },
                }),
              }}
              pressedMarkerStyle={{
                ...Platform.select({
                  android: {
                    height: 25,
                    width: 25,
                    borderRadius: 20,
                    backgroundColor: Colors.THEME_GOLD,
                  },
                }),
              }}
              selectedStyle={{backgroundColor: Colors.THEME_BROWN}}
              unselectedStyle={{
                backgroundColor: '#ECECEC',
                // borderColor: '#f23476',
                // borderWidth: 0.5,
              }}
              trackStyle={{
                height: 5,
              }}
              touchDimensions={{
                height: 40,
                width: 40,
                borderRadius: 20,
                slipDisplacement: 40,
              }}
            />
          </View>
          <MyButton
            text="APPLY"
            style={{
              width: width * 0.9,
              marginTop: 41,
              marginBottom: 10,
              backgroundColor: Colors.THEME_GOLD,
            }}
            onPress={onApplyFilter}
          />
          <MyButton
            text="CLEAR"
            style={{
              width: width * 0.9,
              marginBottom: 10,
              backgroundColor: Colors.THEME_BROWN,
            }}
            onPress={onClearFilter}
          />
        </ScrollView>
      </View>
      {/* </KeyboardAvoidingView> */}
    </Modal>
  );
};

export default OrdersFilter;
