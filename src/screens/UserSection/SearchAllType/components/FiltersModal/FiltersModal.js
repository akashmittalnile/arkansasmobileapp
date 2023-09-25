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
import Dropdown from '../../../../../components/Dropdown/Dropdown';

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
  tempSelectedCourseCategries,
  setTempSelectedCourseCategries,
  TempSelectedProductCategries,
  setTempSelectedProductCategries,
  priceFilterValues,
  tempSelectedPriceFilter,
  setTempSelectedPriceFilter,
  tempSelectedRatingValues,
  setTempSelectedRatingValues,
}) => {
  //function : modal function
  const [allRatingValues] = useState(['1', '2', '3', '4', '5']);
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
  const getCategoryDropdownData = () => {
    // console.log('getCategoryDropdownData', temporarySelectedTab);
    const data =
      temporarySelectedTab === '1' ? courseCategries : productCategries;
    return data?.map(el => ({label: el.name, value: el.name}));
  };
  const addRating = value => {
    // if clicked on already selected rating, remove it
    if (tempSelectedRatingValues?.includes(value)) {
      let tempSelectedRatingValuesCopy = [...tempSelectedRatingValues];
      tempSelectedRatingValuesCopy = tempSelectedRatingValuesCopy.filter(
        el => el !== value,
      );
      setTempSelectedRatingValues([...tempSelectedRatingValuesCopy]);
    } else {
      // if clicked on unselected rating, add it
      const tempSelectedRatingValuesCopy = [...tempSelectedRatingValues];
      tempSelectedRatingValuesCopy.push(value);
      setTempSelectedRatingValues([...tempSelectedRatingValuesCopy]);
    }
  };
  //UI
  return (
    <Modal
      visible={visible}
      onRequestClose={closeModal}
      animationType="fade"
      onShow={() => {
        setTemporarySelectedTab(selectedTab);
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
            {tabs?.map((el, index) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  setTemporarySelectedTab(el?.id);
                  // on change type, remove older select category data
                  if (temporarySelectedTab !== el?.id) {
                    el?.id == '2'
                      ? setTempSelectedCourseCategries([])
                      : setTempSelectedProductCategries([]);
                  }
                }}>
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
            ))}
            <MyText
              text={'Choose Category'}
              textColor={Colors.DARK_GREY}
              fontSize={16}
              fontFamily="medium"
              marginBottom={10}
              marginTop={20}
            />
            <Dropdown
              // data={developerData}
              data={getCategoryDropdownData()}
              value={
                temporarySelectedTab == '1'
                  ? tempSelectedCourseCategries
                  : TempSelectedProductCategries
              }
              setValue={
                temporarySelectedTab == '1'
                  ? setTempSelectedCourseCategries
                  : setTempSelectedProductCategries
              }
              placeholder={`Select Categories`}
              style={{marginBottom: 10}}
            />
            <MyText
              text={'Select Price Filter'}
              textColor={Colors.DARK_GREY}
              fontSize={16}
              fontFamily="medium"
              marginBottom={10}
              marginTop={40}
            />
            {priceFilterValues?.map((el, index) => (
              <TouchableWithoutFeedback
                onPress={() => setTempSelectedPriceFilter(el?.id)}>
                <View style={styles.statusView}>
                  <Image
                    source={
                      tempSelectedPriceFilter === el?.id
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
            ))}
            <MyText
              text={'Select Rating Filter'}
              textColor={Colors.DARK_GREY}
              fontSize={16}
              fontFamily="medium"
              marginBottom={10}
              marginTop={40}
            />
            {allRatingValues?.map(el => (
              <TouchableWithoutFeedback onPress={() => addRating(el)}>
                <View style={styles.statusView}>
                  <Image
                    source={
                      tempSelectedRatingValues.includes(el)
                        ? require('assets/images/checkbox-selected.png')
                        : require('assets/images/checkbox.png')
                    }
                    style={styles.radioButton}
                  />
                  <MyText
                    text={el}
                    textColor={Colors.DARK_GREY}
                    fontSize={14}
                    marginLeft={10}
                  />
                </View>
              </TouchableWithoutFeedback>
            ))}

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
