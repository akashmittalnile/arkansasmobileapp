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
  Linking,
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
import {width} from '../../global/Constant';

// const AccordionItem = ({num, time, title, description}) => {
const AccordionItem = ({
  item,
  index,
  documents,
  setDocuments,
  uploadDocument,
  deleteDocument,
  setShowModal,
  markAsCompleted,
  allChapterSteps,
}) => {
  // console.log('AccordionItem item', item?.type, item);
  const shareValue = useSharedValue(0);
  const [bodySectionHeight, setBodySectionHeight] = useState(0);
  const bodyHeight = useAnimatedStyle(() => ({
    height: interpolate(shareValue.value, [0, 1], [0, bodySectionHeight]),
  }));

  const openDocument = async id => {
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
      const documentsCopy = [...documents];
      documentsCopy.push({resp, id});
      setDocuments([...documentsCopy]);
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

  const showVideo = file => {
    setShowModal({
      isVisible: true,
      data: {file},
    });
  };

  const openPdfInBrowser = file => {
    console.log('openPdfInBrowser', file);
    const link = `https://docs.google.com/viewerng/viewer?url=${file}`;
    Linking.openURL(link);
  };

  const isPrerequisiteCompleted = item => {
    // if first chapter step, ignore its prerequisite
    const isFirstStep = allChapterSteps[0]?.id === item.id;
    if (isFirstStep) {
      return true;
    }
    // if this step doesn't require previous step completed, return true
    if (item?.prerequisite == '0') {
      return true;
    }
    const index = allChapterSteps.findIndex(el => el.id == item.id);
    const isPreviousStepComplete =
      allChapterSteps[index - 1]?.is_completed === '1';
    if (isPreviousStepComplete) {
      return true;
    }
    return false;
  };

  return (
    <View
      style={[
        styles.subContainer,
        item.type === 'video' ? {backgroundColor: Colors.THEME_BROWN} : null,
      ]}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.btnStyle}
        onPress={toggleButton}>
        <View style={styles.leftRow}>
          <View style={styles.leftSubRow}>
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
                textColor={item.type === 'video' ? 'white' : Colors.LIGHT_GREY}
              />
              {item.type === 'video' ? (
                <View style={styles.timerRow}>
                  <Image source={require('assets/images/clock.png')} />
                  <MyText
                    text={'15:00'}
                    fontFamily="regular"
                    fontSize={13}
                    textColor={'white'}
                    style={{marginLeft: 5}}
                  />
                </View>
              ) : null}
            </View>
          </View>
          {item.type === 'video' ? (
            <Image
              source={require('assets/images/tick-circle-white.png')}
              style={{}}
            />
          ) : null}
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
          {!isPrerequisiteCompleted(item) ? (
            <View>
              <MyText
                text={'Please complete previous step first'}
                fontFamily="medium"
                fontSize={24}
                textColor={'black'}
                style={{marginBottom: 41}}
              />
            </View>
          ) : (
            <>
              {item.type === 'video' ? (
                <View>
                  <ImageBackground
                    source={{uri: item?.thumb?.path}}
                    imageStyle={{borderRadius: 10}}
                    style={styles.crseImg}>
                    <TouchableOpacity
                      onPress={() => {
                        showVideo(item?.file);
                      }}>
                      <Image source={require('assets/images/play-icon.png')} />
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
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
                  <TouchableOpacity
                    onPress={() => {
                      openPdfInBrowser(item?.file);
                    }}>
                    <MyText text="View Pdf" />
                  </TouchableOpacity>
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
                <>
                  <View style={styles.assignmentContainer}>
                    {item?.file == '' ? (
                      <MyText
                        text={'Upload Your File'}
                        fontFamily="medium"
                        fontSize={24}
                        textColor={'black'}
                        style={{marginBottom: 41}}
                      />
                    ) : null}
                    <View style={styles.dropImgView}>
                      {wasFileSubmitted(item?.file) ? (
                        <View style={styles.pdfContainer}>
                          <Image
                            source={require('assets/images/pdf-icon.png')}
                          />
                          <MyText
                            text={
                              documents?.find(el => el?.id === item?.id)?.resp
                                ?.name
                            }
                            textColor={Colors.LIGHT_GREY}
                            fontSise={13}
                            fontFamily="regular"
                            style={{marginLeft: 10, width: '85%'}}
                          />
                        </View>
                      ) : !isLocalFileSelected(documents, item) ? (
                        <>
                          <TouchableOpacity
                            onPress={() => openDocument(item.id)}>
                            <MyText
                              text={'Select File Here'}
                              fontFamily="medium"
                              fontSize={18}
                              textColor={Colors.DARK_GREY}
                              style={{marginBottom: 40}}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => uploadDocument(item.id)}>
                            <Image
                              source={require('assets/images/upload-file.png')}
                            />
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <View style={styles.pdfContainer}>
                            <View style={styles.pdfLeftRow}>
                              <Image
                                source={require('assets/images/pdf-icon.png')}
                              />
                              <MyText
                                text={
                                  documents?.find(el => el?.id === item?.id)
                                    ?.resp?.name
                                }
                                textColor={Colors.LIGHT_GREY}
                                fontSise={13}
                                fontFamily="regular"
                                style={{marginLeft: 10, width: '85%'}}
                              />
                            </View>
                            <TouchableOpacity
                              onPress={() => deleteDocument(item.id)}
                              style={styles.deleteButtonStyle}>
                              <MyIcon.MaterialIcons
                                name="delete"
                                color={Colors.RED}
                                size={24}
                              />
                            </TouchableOpacity>
                          </View>
                        </>
                      )}
                    </View>
                  </View>
                  {/* <View style={styles.midImage}>
                {!documents?.find(el => el?.id === item?.id) ? (
                  <View style={styles.imageViewStyle}>
                    <TouchableOpacity
                      onPress={() => openDocument(item.id)}
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
                      onPress={() => deleteDocument(item.id)}
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
                  text="Upload File"
                  style={{
                    width: width * 0.9,
                    marginBottom: 10,
                    backgroundColor: Colors.THEME_BROWN,
                  }}
                  onPress={() => uploadDocument(item.id)}
                />
              </View> */}
                </>
              ) : null}

              {showMarkCompleteButton(item) ? (
                <View
                  style={[
                    styles.buttonsRow,
                    Platform.OS === 'ios' ? {paddingTop: 16} : null,
                  ]}>
                  <MyButton
                    text="Mark as complete"
                    onPress={() => markAsCompleted(item.id)}
                    style={[
                      {
                        width: '100%',
                        height: 50,
                        backgroundColor: Colors.THEME_BROWN,
                        marginTop: 10,
                      },
                      Platform.OS === 'ios' ? {paddingTop: 16} : null,
                    ]}
                  />
                </View>
              ) : null}
            </>
          )}

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

const wasFileSubmitted = file => {
  if (file === '' || file === null) {
    return false;
  } else {
    return true;
  }
};
const isLocalFileSelected = (documents, item) => {
  return documents?.find(el => el?.id === item?.id);
};

const showMarkCompleteButton = item => {
  if (item.type === 'quiz' || item.type === 'survey') {
    return false;
  }
  return false;
};
