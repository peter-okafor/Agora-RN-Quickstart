import React, { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';

import requestCameraAndAudioPermission from './components/Permission';
import styles from './components/Style';

interface Props {}

/**
 * @property peerIds Array for storing connected peers
 * @property appId
 * @property channelName Channel Name for the current session
 * @property joinSucceed State variable for storing success
 */
interface State {
  appId: string;
  token: string;
  channelName: string;
  joinSucceed: boolean;
  peerIds: number[];
}

const App: React.FC = (props:Props) => {
  var _engine: RtcEngine

  const thisState:State = {
    appId: YourAppId,
    token: YourToken,
    channelName: 'channel-x',
    joinSucceed: false,
    peerIds: [],
  }

  const [state, setState] = useState(thisState)

  if (Platform.OS === 'android') {
    // Request required permissions from Android
    requestCameraAndAudioPermission().then(() => {
      console.log('requested!')
    })
  }

  useEffect(() => {
    init()
  }, [])

  /**
   * @name init
   * @description Function to initialize the Rtc Engine, attach event listeners and actions
   */
  const init = async () => {
    const { appId } = state
    _engine = await RtcEngine.create(appId);
    await _engine.enableVideo();

    _engine.addListener('Warning', (warn) => {
      console.log('Warning', warn);
    });

    _engine.addListener('Error', (err) => {
      console.log('Error', err);
    });

    _engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      // Get current peer IDs
      const { peerIds } = state;
      // If new user
      if (peerIds.indexOf(uid) === -1) {
        setState({
          ...state,
          // Add peer ID to state array
          peerIds: [...peerIds, uid],
        });
      }
    });

    _engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      const { peerIds } = state;
      setState({
        ...state,
        // Remove peer ID from state array
        peerIds: peerIds.filter((id) => id !== uid),
      });
    });

    // If Local user joins RTC channel
    _engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      // Set state variable to true
      setState({
        ...state,
        joinSucceed: true
      })
    });
  }

  /**
   * @name startCall
   * @description Function to start the call
   */
  const startCall = async () => {
    // Join Channel using null token and channel name
    await _engine?.joinChannel(
      state.token,
      state.channelName,
      null,
      0
    );
  };

  /**
   * @name endCall
   * @description Function to end the call
   */
  const endCall = async () => {
    await _engine?.leaveChannel();
    setState({ ...state, peerIds: [], joinSucceed: false });
  };

  const _renderVideos = () => {
    const { joinSucceed } = state;
    return joinSucceed ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.max}
          channelId={state.channelName}
          renderMode={VideoRenderMode.Hidden}
        />
        {_renderRemoteVideos()}
      </View>
    ) : null;
  };

  const _renderRemoteVideos = () => {
    const { peerIds } = state;
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={{ paddingHorizontal: 2.5 }}
        horizontal={true}
      >
        {peerIds.map((value) => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.remote}
              uid={value}
              channelId={state.channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.max}>
      <View style={styles.max}>
        <View style={styles.buttonHolder}>
          <TouchableOpacity onPress={() => startCall()} style={styles.button}>
            <Text style={styles.buttonText}> Start Call </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => endCall()} style={styles.button}>
            <Text style={styles.buttonText}> End Call </Text>
          </TouchableOpacity>
        </View>
        {() => _renderVideos()}
      </View>
    </View>
  );
}

export default App