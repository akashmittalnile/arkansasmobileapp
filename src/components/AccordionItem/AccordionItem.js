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
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {styles} from './AccordionItemStyle';
import MyText from '../MyText/MyText';
import {Colors} from '../../global/Index';

// const AccordionItem = ({num, time, title, description}) => {
const AccordionItem = ({item, index}) => {
  console.log('AccordionItem item', item?.type ,item);
  const shareValue = useSharedValue(0);
  const [bodySectionHeight, setBodySectionHeight] = useState(0);
  const bodyHeight = useAnimatedStyle(() => ({
    height: interpolate(shareValue.value, [0, 1], [0, bodySectionHeight]),
  }));

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(shareValue.value, [0, 1], [0, 180])}deg`,
        },
      ],
    };
  });

  const toggleButton = () => {
    if (shareValue.value === 0) {
      shareValue.value = withTiming(1, {
        // duration: 500,
        duration: 200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
    } else {
      shareValue.value = withTiming(0, {
        // duration: 500,
        duration: 200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      });
    }
  };

  return (
    <View style={styles.subContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.btnStyle}
        onPress={toggleButton}>
        <View style={styles.leftRow}>
          <View style={styles.numView}>
            <MyText
              text={index + 1}
              fontFamily="regular"
              fontSize={13}
              textColor={'black'}
            />
          </View>
          <View style={{marginLeft: 10}}>
            <MyText
              text={item.title}
              fontFamily="medium"
              // fontSize={14}
              fontSize={16}
              textColor={Colors.LIGHT_GREY}
            />
            {item.type === 'video' ? (
              <View style={styles.timerRow}>
                <Image source={require('assets/images/clock.png')} />
                <MyText
                  text={'15:00'}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.LIGHT_GREY}
                  style={{marginLeft: 5}}
                />
              </View>
            ) : null}
          </View>
        </View>
        <Animated.View style={iconStyle}>
          <Image source={require('assets/images/arrow-down.png')} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.descStyle, bodyHeight]}>
        <View
          style={styles.bodyContainer}
          onLayout={event => {
            setBodySectionHeight(event.nativeEvent.layout.height);
          }}>
            {item.type === 'video' ? 
            <Image source={{uri: index?.thumb?.path}} style={{height: 50, width: 50}} />
            :null}
          {/* <MyText
            text={description}
            fontFamily="regular"
            fontSize={13}
            textColor={Colors.LIGHT_GREY}
            style={{}}
          /> */}
        </View>
      </Animated.View>
    </View>
  );
};

export default AccordionItem;
