//react components
import React, {useRef, useState} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
//import : custom components
import MyText from 'components/MyText/MyText';
import DateSelector from 'components/DateSelector/DateSelector';
// global
import {Colors, MyIcon} from 'global/Index';
//third parties
import moment from 'moment';
import Toast from 'react-native-simple-toast';
//styles
import {styles} from './FiltersModalStyle';

const FiltersModal = ({
  visible,
  setVisibility,
  selectedStatus,
  setSelectedStatus,
  selectedOption,
  setSelectedOption,

  tabs,
  courseCategries,
  productCategries,
  selectedTab,
  setSelectedTab,
  temporarySelectedTab,
  setTemporarySelectedTab,
}) => {
  //function : modal function
  const closeModal = () => {
    setVisibility(false);
  };
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity onPress={closeModal} style={{flex: 1}}>
          <Image
            source={require('assets/images/back-arrow.png')}
            style={styles.backImage}
          />
        </TouchableOpacity>
        <View style={styles.titleView}>
          <MyText
            text="Filters"
            textColor={Colors.DARK_GREY}
            textAlign="center"
            fontSize={16}
            fontFamily="medium"
          />
        </View>
        <View style={{flex: 1}} />
      </View>
    );
  };
  //UI
  return (
    <Modal
      visible={visible}
      onRequestClose={closeModal}
      animationType="fade"
      onShow={()=>{
        setTemporarySelectedTab(selectedTab)
      }}
      transparent>
      <View style={styles.container}>
        <TouchableOpacity style={styles.blurView} onPress={closeModal} />
        <View style={styles.mainView}>
          <ScrollView>
            {renderHeader()}
            <MyText
              text={'Select Type'}
              textColor={Colors.DARK_GREY}
              fontSize={16}
              fontFamily="medium"
              marginBottom={10}
              marginTop={40}
            />
            {tabs?.map((el, index) => 
            <TouchableWithoutFeedback
              onPress={() => setTemporarySelectedTab(el?.id)}>
              <View style={styles.statusView}>
                <Image
                  source={
                    temporarySelectedTab === el?.id
                      ? require('assets/images/radio-button-selected.png')
                      : require('assets/images/radio-button.png')
                  }
                  style={styles.radioButton}
                />
                <MyText
                  text={el?.name}
                  textColor={Colors.DARK_GREY}
                  fontSize={14}
                  marginLeft={10}
                />
              </View>
            </TouchableWithoutFeedback>
            )}
            <MyText
              text={'Choose Option'}
              textColor={Colors.DARK_GREY}
              fontSize={16}
              fontFamily="medium"
              marginBottom={10}
              marginTop={20}
            />
            <TouchableWithoutFeedback onPress={() => setSelectedOption('Buy')}>
              <View style={styles.statusView}>
                <Image
                  source={
                    selectedOption === 'Buy'
                      ? require('assets/images/checkbox-selected.png')
                      : require('assets/images/checkbox.png')
                  }
                  style={styles.radioButton}
                />
                <MyText
                  text={'Buy'}
                  textColor={Colors.DARK_GREY}
                  fontSize={14}
                  marginLeft={10}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={() => setSelectedOption('Sell')}>
              <View style={styles.statusView}>
                <Image
                  source={
                    selectedOption === 'Sell'
                      ? require('assets/images/checkbox-selected.png')
                      : require('assets/images/checkbox.png')
                  }
                  style={styles.radioButton}
                />
                <MyText
                  text={'Sell'}
                  textColor={Colors.DARK_GREY}
                  fontSize={14}
                  marginLeft={10}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() => setSelectedOption('Option')}>
              <View style={styles.statusView}>
                <Image
                  source={
                    selectedOption === 'Option'
                      ? require('assets/images/checkbox-selected.png')
                      : require('assets/images/checkbox.png')
                  }
                  style={styles.radioButton}
                />
                <MyText
                  text={'Option'}
                  textColor={Colors.DARK_GREY}
                  fontSize={14}
                  marginLeft={10}
                />
              </View>
            </TouchableWithoutFeedback>

            <TouchableOpacity
              onPress={closeModal}
              style={styles.buttonContainer}>
              <MyText
                text="Apply"
                textColor={Colors.WHITE}
                fontSize={14}
                fontFamily="medium"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton}>
              <MyText
                text="Reset"
                textColor={Colors.DARK_GREY}
                fontSize={14}
                fontFamily="medium"
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FiltersModal;
