/**
 * @format
 */
import 'react-native-reanimated';
import {AppRegistry} from 'react-native';
import App from './App.js';
import {name as appName} from './app.json';
import {playbackService} from './trackPlayerServices';

AppRegistry.registerComponent(appName, () => App);
