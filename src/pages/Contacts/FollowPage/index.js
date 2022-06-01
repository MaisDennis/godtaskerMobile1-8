import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { useTranslation } from 'react-i18next';
// -----------------------------------------------------------------------------
import {
  AddIcon,
  Container,
  Header, HeaderTabView, HeaderTouchable,
  List,
  SearchBarTextInput,
  Title,
  UpperTabView, UpperTabText,
} from './styles'
import HeaderView from '~/components/HeaderView'
import logo from '~/assets/detective/detective_remake.png'
import Contacts from '~/components/Contacts'
import api from '~/services/api';

export default function FollowPage({ navigation, route }) {
  const { t, i18n } = useTranslation()
  const data = route.params;
  console.log(data)
  const userId = useSelector( state => state.user.profile.id)
  const user_name = useSelector(state => state.user.profile.user_name);
  const contacts_update = useSelector( state => state.contact.profile)

  const [contacts, setContacts] = useState([]);
  const [defaultContacts, setDefaultContacts] = useState([]);
  const [inputState, setInputState] = useState('');

  useEffect(() => {
    loadContacts(data.contact_name, '');
  }, [contacts_update]);

  const formattedDate = fdate =>
  fdate == null
    ? '-'
    : format(fdate, "dd 'de' MMMM',' yyyy", { locale: pt });
  const todayDate = formattedDate(new Date())

  async function loadContacts(contact_name, input) {
    setInputState(input)
    const response = await api.get(`users/following`, {
      params: {
        contactName: contact_name,
        nameFilter: `${input}`,
      }
    })
    setContacts(response.data)
    setDefaultContacts(response.data)
    // sorter
    // if(response.data) {
    //   const sortedResponseData = response.data.sort(compare)
    //   setContacts(sortedResponseData)
    //   // setContacts('Hi')
    //   setDefaultContacts(sortedResponseData)
    // }
  }

  // async function loadWorkers(input) {
  //   setInputState(input)
  //   let response = await api.get('/workers', {
  //     params: {
  //       nameFilter: `${input}`,
  //     }
  //   })
  //   setContacts(response.data)
  // }

  // function compare(a, b) {
  //   if (a.worker_name > b.worker_name) {
  //     return 1;
  //   }
  //   if (a.worker_name < b.worker_name) {
  //     return -1;
  //   }
  //   return 0;
  // }

  // const handleUpdateInput = async (input) => {
  //   const filteredList = defaultContacts.filter(c => {
  //     let contactName = c.first_name + c.last_name + c.worker_name
  //     return contactName.toLowerCase().includes(input.toLowerCase())
  //   })
  //   setContacts(filteredList)
  //   setInputState(input)
  // }

  // const renderItem = ({ item, index }) => (
  //   <Contacts key={index} data={item} navigation={navigation}/>
  // );

  // function handleCreateContact() {
  //   navigation.navigate('ContactCreate')
  // }
  // ---------------------------------------------------------------------------
  return (
    <Container>
      <Header>
        <SearchBarTextInput
          placeholder='Search'
          onChangeText={(input) => loadContacts( data.worker_name, input)}
          returnKeyType='search'
          value={inputState}
        />
      </Header>

      { contacts == ''
        ? (
          <Title>{t('NoContactsRegistered')}</Title>
        )
        : (
          <List
            data={contacts}
            keyExtractor={item => String(item.email)}

            renderItem={({ item }) => (
              <Contacts
                key={item.emal}
                data={item}
                navigation={navigation}
              />
            )}
          />
        )
      }
    </Container>
  )
}
