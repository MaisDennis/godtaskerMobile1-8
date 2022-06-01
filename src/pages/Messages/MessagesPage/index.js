import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native'
import { useSelector } from 'react-redux';
import { Swipeable } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import {
  AddIcon,
  Container,
  Header, HeaderImage, HeaderTabView, HeaderTouchable,
  List,
  SearchBarTextInput, SpaceView,
  Title,
} from './styles';
import Messages from '~/components/Messages';
import logo from '~/assets/detective/detective_remake.png'
import api from '~/services/api';
import firebase from '~/services/firebase'
// -----------------------------------------------------------------------------
export default function MessagesPage({ navigation, route }) {
  const { t, i18n } = useTranslation()
  const user_id = useSelector(state => state.user.profile.id);
  const user_email = useSelector(state => state.user.profile.email);
  const workerID = useSelector(state => state.worker.profile.id);

  const messages_update = useSelector(state => state.message.profile);

  const [messages, setMessages] = useState([]);
  const [defaultMessages, setDefaultMessages] = useState();
  const [inputState, setInputState] = useState();
  const [lastMessageTime, setLastMessageTime] = useState();

  useEffect(() => {
    loadMessages()
  }, [ messages_update ]);

    async function loadMessages() {
      const messagesResponse = await api.get(`messages`, {
        params: {
          user_email,
          // stringified_blocked_list: JSON.stringify([]),
        },
      })
      // console.log(messagesResponse.data)
      const Data = messagesResponse.data
      Data.sort(compare);
      setMessages(Data)
      setDefaultMessages(Data)
    }

  function compare(a, b) {
    if (a.messaged_at > b.messaged_at) {
      return -1;
    }
    if (a.messaged_at < b.messaged_at) {
      return 1;
    }
    return 0;
  }

  const handleUpdateInput = async (input) => {
    const filteredList = defaultMessages.filter(m => {
      let messageSearch = m.name + m.worker.worker_name + m.user.user_name
      return messageSearch.toLowerCase().includes(input.toLowerCase())
    })
    console.log(filteredList)
    setMessages(filteredList)
    setInputState(input)
  }

  const LeftActions = () => {
    <HeaderTabView>
      <Title>Hello</Title>
    </HeaderTabView>
  }
  // -----------------------------------------------------------------------------
  return (
    <Container>
      <Header>
        <SpaceView>
          <HeaderImage
            source={logo}
          />
        </SpaceView>

        <SearchBarTextInput
          placeholder={t('Search')}
          onChangeText={handleUpdateInput}
          value={inputState}
        />
        <HeaderTouchable
          onPress={() => loadMessages()}
        >
          <AddIcon name='refresh-cw' size={20}/>
        </HeaderTouchable>
      </Header>
      { messages == ''
        ? (
          <Title>{t('NoMessages')}</Title>
        )
        : (
          <>
            <List
              data={messages}
              keyExtractor={item => String(item.id)}
              renderItem={({ item, index }) => (
                <Swipeable
                  renderLeftActions={LeftActions}
                  onSwipeableLeftOpen={() => Alert.alert('Hi')}
                >
                <Messages
                  key={index}
                  data={item}
                  navigation={navigation}
                />
                </Swipeable>
              )}
            />
          </>
        )
      }
    </Container>
  );
}
