/**
 * @format
 */
import 'react-native-reanimated';
import TrackPlayer from 'react-native-track-player';
import {AppRegistry} from 'react-native';
import App from './App.js';
import {name as appName} from './app.json';
import {playbackService} from './trackPlayerServices';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);
