import React, { useEffect, useState, useRef } from 'react';
// window.navigator.userAgent = 'react-native';
import io from 'socket.io-client/dist/socket.io';
import { Alert, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
// -----------------------------------------------------------------------------
import Routes from './routes';
import api from '~/services/api';
// -----------------------------------------------------------------------------
export default function App() {
  const { t, i18n } = useTranslation;
  const userId = useSelector( state => state.user.profile ? state.user.profile.id : null)
  // const workerId = useSelector( state => state.worker.profile ? state.worker.profile.id : null)
  // const authToken = useSelector( state => state.auth.token ? state.auth.token : null)
  // const[test, setTest] = useState();
  let fcmUnsubscribe = null;
  const socketRef = useRef();


  useEffect(() => {
    SplashScreen.hide();
    // console.log(RNLocalize.getLocales()[0].languageCode);
    requestUserPermission();
    // socketRef.current = io('http://192.168.1.105:3333');
    // socketRef.current = io('http://10.0.3.2:3333');
    // const socket = io('http://10.0.3.2:3333');

    // socket.on('connect', msg => {
    //   console.log('socket connected')
    // })

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      // PushNotification.localNotification({
      //   channelId: 'godtaskerChannel01',
      //   title: remoteMessage.notification.title,
      //   message: remoteMessage.notification.body,
      // })
        PushNotification.localNotification({
          channelId: 'godtaskerChannel01',
          title: remoteMessage.data.title,
          message: remoteMessage.data.message,
        })
    });


    return unsubscribe;
  }, []);



  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    // console.log('Hello', authStatus)
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      const token = await messaging().getToken();
      console.log('Token: ', token)
      // setTest(token)
      if(userId) {
        await api.put(`users/notifications/${userId}`, {
          notification_token: token,
          // worker_id: workerId,
        })
      }

    }

    messaging().onTokenRefresh(async token => {
      console.log('messaging.onTokenRefresh: ', token)
      await api.put(`users/notifications/${userId}`, {
        notification_token: token,
        // worker_id: workerId,
      })
    });

    // this is for testing
    // fcmUnsubscribe = messaging().onMessage(async remoteMessage => {
    //   console.log('A new message arrived!', remoteMessage)
    //   console.log(
    //     remoteMessage.data,
    //   )
    // })

    // messaging()
    //   .onNotificationOpenedApp(remoteMessage => {
    //     console.log('Notification caused app to open from background state: '
    //       , remoteMessage
    //     )
    //   })

    // messaging()
    //   .getInitialNotification()
    //   .then(remoteMessage => {
    //     if(remoteMessage) {
    //       console.log('Notification caused app to open from quit state: '
    //         , remoteMessage
    //       )
    //     }
    //   })
  }
  // ---------------------------------------------------------------------------
  return (
    <>
    {/* <View>
      <Text style={{color: '#fff'}}>{test}</Text>
    </View> */}
    <Routes />
  </>
  );
}
