import {StyleSheet} from 'react-native';
import {height, width} from '../../global/Constant';
import {Colors} from '../../global/Index';

export const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  btnStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  subContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    marginBottom: 10,
    flex: 1,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 2,
  },
  svgStyle: {
    width: 20,
    height: 20,
  },
  descStyle: {
    overflow: 'hidden',
  },
  title: {
    fontWeight: '600',
  },
  bodyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    paddingBottom: 20,
    alignItems:'center',
    width:'100%'
  },
  numView: {
    height: 31,
    width: 31,
    borderRadius: 31 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECECEC',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
  leftSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: width,
    height: height,
  },
  midImage: {
    height: 180,
    width: 350,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#E7F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonStyle: {
    position: 'absolute',
    backgroundColor: Colors.WHITE,
    borderRadius: 100,
    padding: 5,
    right: 5,
  },
  addButtonStyle: {
    backgroundColor: Colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  crseImg: {
    height: 167,
    width: width * 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  assignmentContainer: {
    paddingHorizontal: 22,
    paddingTop: 34,
    alignItems: 'center',
    marginBottom: 10,
    width: width * 0.9,
    alignItems:'center',
  },
  dropImgView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 42,
    borderRadius: 10,
    backgroundColor: Colors.SCREEN_BG,
    width: '90%',
  },
  pdfContainer: {
    width: '90%',
    backgroundColor: 'white',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  pdfLeftRow: {
    // width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
