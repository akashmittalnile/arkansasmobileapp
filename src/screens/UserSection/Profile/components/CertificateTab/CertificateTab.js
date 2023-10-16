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
//import : custom components
import MyText from 'components/MyText/MyText';
import CustomLoader from 'components/CustomLoader/CustomLoader';
//import : third parties
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-simple-toast';
//import : global
import {Colors, Constant, MyIcon, ScreenNames, Service} from 'global/Index';
//import : styles
import {styles} from './CertificateTabStyle';
//import : modal
//import : redux
import {connect, useSelector} from 'react-redux';
import {width, height} from 'global/Constant';
import Divider from 'components/Divider/Divider';
import NameEnterValue from '../../../../../components/NameEnterValue/NameEnterValue';
import MyButton from '../../../../../components/MyButton/MyButton';
// import {WebView} from 'react-native-webview';
import Pdf from 'react-native-pdf';

const CertificateTab = ({
  certificateList,
  downloadCertificate,
  openInBrowser,
}) => {
  const renderCertificate = ({item}) => {
    return (
      <View style={styles.courseContainer}>
        <View style={styles.courseSubContainer}>
          <ImageBackground
            source={{uri: item?.thumb?.path}}
            style={styles.crseImg}
            imageStyle={{borderRadius: 10}}></ImageBackground>
          {/* <View style={styles.crseImg}>
            <Pdf
              source={{uri: item?.download_pdf}}
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
              style={styles.crseImg}
            />
          </View> */}
          <View style={{marginLeft: 11, width: width * 0.55}}>
            <MyText
              text={item.title}
              fontFamily="regular"
              fontSize={13}
              textColor={Colors.LIGHT_GREY}
              style={{}}
            />
            <View style={styles.middleRow}>
              <View style={styles.ratingRow}>
                <Image source={require('assets/images/star.png')} />
                <MyText
                  text={item.avg_rating}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.LIGHT_GREY}
                  letterSpacing={0.13}
                  style={{marginLeft: 5}}
                />
              </View>
              <View style={styles.crtrRow}>
                {/* <Image
                  source={require('assets/images/profile-circle.png')}
                  // style={styles.crtrImg}
                /> */}
                <Image
                  source={{uri: item?.creator_image}}
                  style={styles.createImgStyle}
                />
                <MyText
                  text={item.creator_name}
                  fontFamily="regular"
                  fontSize={13}
                  textColor={Colors.THEME_GOLD}
                  letterSpacing={0.13}
                  numberOfLines={1}
                  style={{marginLeft: 10, width: '70%'}}
                />
              </View>
            </View>
            <View style={styles.buttonsRow}>
              <MyButton
                text="VIEW"
                style={{
                  width: '35%',
                  height: 40,
                  marginTop: 8,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={() => openInBrowser(item.download_pdf)}
              />
              <MyButton
                text="DOWNLOAD"
                style={{
                  width: '50%',
                  height: 40,
                  marginTop: 8,
                  marginLeft: 12,
                  backgroundColor: Colors.THEME_BROWN,
                }}
                onPress={() =>
                  downloadCertificate(item?.download_pdf, item?.title)
                }
              />
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <FlatList
      data={certificateList}
      style={{marginTop: 28}}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderCertificate}
    />
  );
};

export default CertificateTab;
