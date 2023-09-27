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
  chapindex,
  setShowPrerequisiteModal,
  setPrerequisiteModalText
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

  const toggleButton = item => {
    // if prerequisite not completed, show prerequisite modal
    if (!isPrerequisiteCompleted(item)) {
      setShowPrerequisiteModal(true);
      setPrerequisiteModalText(String(chapindex + 1) + ': ' +getPreviousStepName(item))
      return;
    }

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
  const openQuizInBrowser = link => {
    console.log('openPdfInBrowser', link);
    Linking.openURL(link);
  };

  const isPrerequisiteCompleted = item => {
    // if first chapter step of first chapter, ignore its prerequisite (return true)
    const isFirstStep = allChapterSteps[0]?.id === item.id;
    if (isFirstStep && chapindex === 0) {
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

  const getPreviousStepName = item => {
    const index = allChapterSteps.findIndex(el => el.id == item.id);
    return allChapterSteps[index - 1]?.title;
  };

  return (
    <View
      style={[
        styles.subContainer,
        item?.is_completed === '1'
          ? {backgroundColor: Colors.THEME_BROWN}
          : null,
      ]}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.btnStyle}
        onPress={() => toggleButton(item)}>
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
                textColor={getTextColor(item?.is_completed)}
              />
              {item.type === 'video' ? (
                <View style={styles.timerRow}>
                  <Image source={require('assets/images/clock.png')} />
                  <MyText
                    text={'15:00'}
                    fontFamily="regular"
                    fontSize={13}
                    textColor={getTextColor(item?.is_completed)}
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
          <Image
            source={
              item?.is_completed === '1'
                ? require('assets/images/arrow-down-white.png')
                : require('assets/images/arrow-down.png')
            }
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[styles.descStyle, bodyHeight]}>
        <View
          style={styles.bodyContainer}
          onLayout={event => {
            setBodySectionHeight(event.nativeEvent.layout.height);
          }}>
          {!isPrerequisiteCompleted(item) ? (
            <View
              style={{
                backgroundColor: Colors.SCREEN_BG,
                width: '80%',
                padding: 20,
                marginTop: 20,
              }}>
              <MyText
                text={'Prerequisite(s) have yet not been completed!'}
                fontFamily="medium"
                fontSize={24}
                textColor={'black'}
                textAlign="center"
                style={{marginBottom: 20}}
              />
              <MyText
                text={`To move forward, please complete all prerequisites in Chapter ${
                  chapindex + 1
                }: ${getPreviousStepName(item)}`}
                fontFamily="regular"
                fontSize={18}
                textColor={'black'}
                textAlign="center"
                style={{}}
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
              {item.type === 'quiz' ? (
                item?.is_completed === '0' ? (
                  <View>
                    <MyButton
                      text="Start Quiz"
                      style={{
                        width: width * 0.9,
                        marginBottom: 10,
                        backgroundColor: Colors.THEME_BROWN,
                      }}
                      onPress={() => {
                        openQuizInBrowser(item?.quiz_url);
                      }}
                    />
                  </View>
                ) : item?.is_completed === '1' ? (
                  <View style={{alignItems: 'center'}}>
                    <MyText
                      text={'Tuesday, May 23, 2013 12:53 PM'}
                      fontFamily="medium"
                      fontSize={20}
                      textColor={getTextColor(item.is_completed, true)}
                      style={{marginBottom: 10}}
                    />
                    <MyText
                      text={'40% (0% required to pass)'}
                      fontFamily="medium"
                      fontSize={20}
                      textColor={getTextColor(item.is_completed, true)}
                      style={{}}
                    />
                  </View>
                ) : (
                  <View style={{alignItems: 'center'}}>
                    <MyText
                      text={'Whoops'}
                      fontFamily="medium"
                      fontSize={20}
                      textColor={'black'}
                      style={{marginBottom: 10}}
                    />
                    <MyText
                      text={'You failed this quiz with a score of'}
                      fontFamily="medium"
                      fontSize={20}
                      textColor={'black'}
                      style={{}}
                    />
                    <MyText
                      text={'22%'}
                      fontFamily="medium"
                      fontSize={20}
                      textColor={'black'}
                      style={{}}
                    />
                    <MyText
                      text={'You need 85% to pass'}
                      fontFamily="medium"
                      fontSize={20}
                      textColor={'black'}
                      style={{marginBottom: 10}}
                    />
                    <MyButton
                      text="Retake Quiz"
                      style={{
                        width: width * 0.9,
                        marginBottom: 10,
                        backgroundColor: Colors.THEME_BROWN,
                      }}
                      onPress={() => {}}
                    />
                    <MyText
                      text={'You answered 2 out of 9 questions correctly'}
                      fontFamily="medium"
                      fontSize={20}
                      textColor={'black'}
                      style={{marginTop: 10}}
                    />
                  </View>
                )
              ) : null}
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
                  <View style={styles.pdfContainer}>
                    <Image source={require('assets/images/pdf-icon.png')} />
                    <TouchableOpacity
                      onPress={() => {
                        openPdfInBrowser(item?.file);
                      }}>
                      <MyText
                        text={item.filename}
                        textColor={Colors.LIGHT_GREY}
                        fontSise={13}
                        fontFamily="regular"
                        style={{marginLeft: 10, width: '85%'}}
                      />
                    </TouchableOpacity>
                    {/* <MyText
                      text={
                        documents?.find(el => el?.id === item?.id)?.resp?.name
                      }
                      textColor={Colors.LIGHT_GREY}
                      fontSise={13}
                      fontFamily="regular"
                      style={{marginLeft: 10, width: '85%'}}
                    /> */}
                  </View>
                  {/* <Pdf
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
                  /> */}
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
                        <View style={{alignItems: 'center'}}>
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
                          <TouchableOpacity
                            onPress={() => uploadDocument(item.id)}
                            style={{marginTop: 10}}>
                            <Image
                              source={require('assets/images/upload-file.png')}
                            />
                          </TouchableOpacity>
                        </View>
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
            </>
          )}

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
  if (
    item?.is_completed === '0' &&
    (item.type === 'video' || item.type === 'pdf')
  ) {
    return true;
  }
  return false;
};

const getTextColor = (is_completed, isDarkColor = false) => {
  const darkColor = isDarkColor ? Colors.THEME_BROWN : Colors.LIGHT_GREY;
  return is_completed === '1' ? 'white' : darkColor;
};
