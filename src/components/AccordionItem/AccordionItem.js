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
import {Colors, MyIcon} from '../../global/Index';
import Pdf from 'react-native-pdf';
import DocumentPicker from 'react-native-document-picker';
import Toast from 'react-native-simple-toast';
import MyButton from '../MyButton/MyButton';
import { width } from '../../global/Constant';

// const AccordionItem = ({num, time, title, description}) => {
const AccordionItem = ({
  item,
  index,
  document1,
  setDocument1,
  uploadDocument,
}) => {
  // console.log('AccordionItem item', item?.type, item);
  const shareValue = useSharedValue(0);
  const [bodySectionHeight, setBodySectionHeight] = useState(0);
  const bodyHeight = useAnimatedStyle(() => ({
    height: interpolate(shareValue.value, [0, 1], [0, bodySectionHeight]),
  }));

  const openDocument = async () => {
    try {
      const resp = await DocumentPicker.pickSingle({
        // type: [DocumentPicker.types.allFiles],
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.docx,
        ],
      });
      // if size is greater than 1 mb, reupload image
      if (resp.size > 10 * 1024 * 1024) {
        Toast.show(
          'Assignment document size exceeds 10 MB, please upload smaller assignment document',
          Toast.LONG,
        );
        return;
      }
      if (resp.type === `image/webp`) {
        Toast.show(
          'Webp image format not allowed, please select another image',
          Toast.LONG,
        );
        return;
      }
      console.log('setValue', resp);
      setDocument1(resp);
    } catch (error) {
      console.log('error in openDocument', error);
    }
  };

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
          {item.type === 'video' ? (
            <Image
              source={{uri: item?.thumb?.path}}
              style={{height: 50, width: 50}}
            />
          ) : null}
          {item.type === 'quiz'
            ? item.chapter_question?.map((ques, queIndex) => (
                <View key={queIndex?.toString()}>
                  <Text>{ques?.title}</Text>
                  {ques?.chapter_option?.map((opt, optIndex) => (
                    <View key={optIndex?.toString()}>
                      <Text>{opt?.value}</Text>
                    </View>
                  ))}
                </View>
              ))
            : null}
          {item.type === 'survey'
            ? item.chapter_question?.map((sur, surIndex) => (
                <View key={surIndex?.toString()}>
                  <Text>{sur?.title}</Text>
                  {sur?.chapter_option?.map((opt, optIndex) => (
                    <View key={optIndex?.toString()}>
                      <Text>{opt?.value}</Text>
                    </View>
                  ))}
                </View>
              ))
            : null}
          {item.type === 'pdf' ? (
            <View style={{flex: 1, alignItems: 'center'}}>
              <Pdf
                source={{uri: item?.file}}
                horizontal
                renderActivityIndicator={() => {
                  <ActivityIndicator color="black" size="large" />;
                }}
                trustAllCerts={false}
                onLoadComplete={(numberOfPages, filePath) => {
                  console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                  console.log(`Current page: ${page}`);
                }}
                onError={error => {
                  console.log(error);
                }}
                onPressLink={uri => {
                  console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf}
              />
            </View>
          ) : null}
          {item.type === 'assignment' ? (
            <View style={styles.midImage}>
              {document1 == '' ? (
                <View style={styles.imageViewStyle}>
                  <TouchableOpacity
                    onPress={openDocument}
                    style={styles.addButtonStyle}>
                    <MyIcon.AntDesign
                      name="plus"
                      color={Colors.THEME_GREEN}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.imageViewStyle}>
                  <MyText text="Uploaded documet" />
                  <TouchableOpacity
                    onPress={() => setDocument1('')}
                    style={styles.deleteButtonStyle}>
                    <MyIcon.MaterialIcons
                      name="delete"
                      color={Colors.RED}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              )}
              <MyButton
                text="Upload"
                style={{
                  width: width * 0.9,
                  marginBottom: 10,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={()=>uploadDocument(item.id)}
              />
            </View>
          ) : null}

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
