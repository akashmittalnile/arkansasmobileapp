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
  TouchableWithoutFeedback,
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
import {styles} from './McqScreenStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
// import {WebView} from 'react-native-webview';
import MyButton from '../../../components/MyButton/MyButton';

const McqScreen = ({navigation, dispatch}) => {
  //variables
  const LINE_HEIGTH = 25;
  //variables : redux
  const userToken = useSelector(state => state.user.userToken);
  const userInfo = useSelector(state => state.user.userInfo);
  const [showLoader, setShowLoader] = useState(false);

  const [reviewLaterEnabled, setReviewLaterEnabled] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [answers, setAnswers] = useState([
    {
      id: '1',
      text: `There is some pain associated with this procedure that is ultimately dependent on your specific pain threshold.`,
    },
    {
      id: '2',
      text: `No. You shouldn't feel anything. If you do, there is something wrong with your skin.`,
    },
    {
      id: '3',
      text: `No, it will not hurt whatsoever. You will not be in any pain or discomfort at any point in the procedure. None of my clients have ever been in pain.`,
    },
    {
      id: '4',
      text: `Yes, normally clients are in pain when they receive a permanent cosmetics procedure. It is best for you to come prepared to be in some discomfort. But just like a normal tattoo pain will happen.`,
    },
  ]);

  const onSelectAnswer = id => {
    setSelectedAnswer(id);
  };

  const AnswerView = ({id, text}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onSelectAnswer(id);
        }}
        style={[
          styles.answerContainer,
          selectedAnswer === id ? styles.selectedAnswer : null,
        ]}>
        <MyText
          text={text}
          textColor={Colors.LIGHT_GREY}
          fontSise={14}
          fontFamily="medium"
        />
      </TouchableOpacity>
    );
  };

  //UI
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor={Colors.THEME_BROWN} />
      <View style={styles.container}>
        <MyHeader Title="Chapter 1 Homework Survey" isBackButton />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: '20%', alignItems: 'center'}}
          style={styles.mainView}>
          <View style={styles.titleContainer}>
            <MyText
              text="SURVEY · 4 QUESTIONS·PREREQUISITE"
              textColor={'black'}
              fontSise={16}
              fontFamily="medium"
            />
            <View style={styles.titleBottomRow}>
              <MyText
                text="1/4"
                textColor={'black'}
                fontSise={14}
                fontFamily="medium"
              />
              <TouchableWithoutFeedback
                onPress={() => setReviewLaterEnabled(!reviewLaterEnabled)}>
                <View style={styles.titleBottomRightRow}>
                  <Image
                    source={
                      reviewLaterEnabled
                        ? require('assets/images/checked.png')
                        : require('assets/images/unchecked.png')
                    }
                    style={{height: 23, width: 23}}
                  />
                  <MyText
                    text="Review later"
                    textColor={'black'}
                    fontSise={14}
                    fontFamily="medium"
                    style={{marginLeft: 6}}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>

          <View style={styles.questionContainer}>
            <NumView text="01" />
            <MyText
              text={`Which of the following is an appropriate response to a client asking “How permanent is a permanent cosmetics procedure?”`}
              textColor={Colors.LIGHT_GREY}
              fontSise={14}
              fontFamily="medium"
              style={{marginLeft: 12, width: '85%'}}
            />
          </View>
          {answers?.map(el => (
            <AnswerView key={el.id} id={el.id} text={el.text} />
          ))}
        </ScrollView>
        <CustomLoader showLoader={showLoader} />
      </View>
    </SafeAreaView>
  );
};
const mapDispatchToProps = dispatch => ({
  dispatch,
});
export default connect(null, mapDispatchToProps)(McqScreen);

const NumView = ({text}) => {
  return (
    <View style={styles.numViewStyle}>
      <MyText
        text={text}
        textColor={'white'}
        fontSise={14}
        fontFamily="medium"
      />
    </View>
  );
};
