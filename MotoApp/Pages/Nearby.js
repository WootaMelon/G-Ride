/*=========================
Type: Page

Description:
Nearby Page where users can see other nearby users that are present in the same city they have set in their account
=========================*/
import React, {useEffect, useState} from 'react';
import {SERVER_IP} from '@env';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  Appbar,
  Divider,
  Text,
  Searchbar,
  Button,
  Avatar,
} from 'react-native-paper';
import axios from 'axios';
import {useSelector} from 'react-redux';
import Spinner from '../components/Spinner';

const Nearby = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(true);
  const {user} = useSelector(state => state.auth);
  const [users, setUsers] = useState([]);

  const [searchData, setSearchData] = useState(null);
  const [search, setSearch] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const updateSearch = text => {
    setSearchData([]);
    const newData = users.filter(item => {
      const itemData = item.name.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setSearchData(newData);
    setSearch(text);
  };

  useEffect(() => {
    const getNearbyUsers = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.post(
        `http://${SERVER_IP}:8080/api/users/nearby`,
        {City: user.City},
        config,
      );
      if (response.data) {
        for (let x = 0; x < response.data.length; x++) {
          if (response.data[x].name !== user.name) {
            users.push(response.data[x]);
          }
        }

        setIsLoading(false);
        setRefresh(false);
      }
      return response.data;
    };
    if (refresh) {
      getNearbyUsers();
    }
  }, [user.token, user.City, user.name, refresh, users]);

  const Item = ({id, name, avatar}) => (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('NearbyProfile', {id});
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {avatar === '' ? (
            <Avatar.Image size={48} source={require('../images/biker.jpg')} />
          ) : (
            <Avatar.Image size={48} source={{uri: avatar}} />
          )}

          <Text style={styles.text}>{name}</Text>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <Button icon="chevron-right" color="#ffffff" />
          </View>
        </View>
      </TouchableOpacity>
      <View style={{paddingTop: 10}}>
        <Divider style={{backgroundColor: '#ffffff'}} />
      </View>
    </View>
  );

  const renderItem = ({item}) => (
    <Item id={item._id} name={item.name} avatar={item.avatar} />
  );
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Appbar.Header style={{backgroundColor: 'black'}} dark={true}>
        {showSearchBar ? (
          <Searchbar
            placeholder="Search"
            style={{flex: 1}}
            onChangeText={text => updateSearch(text)}
            value={search}
            clearButtonMode="while-editing"
          />
        ) : (
          <Appbar.Content title="People Nearby" subtitle={user.City} />
        )}
        <Appbar.Action
          icon="magnify"
          onPress={() => {
            setShowSearchBar(!showSearchBar);
            setSearchData(null);
            setSearch('');
          }}
          color="#39FF13"
        />
        <Appbar.Action
          icon="refresh"
          onPress={() => {
            setUsers([]);
            setRefresh(true);
          }}
          color="#39FF13"
        />
      </Appbar.Header>
      <View style={styles.imageContainer}>
        <Image
          source={require('../images/IMG_5535.jpg')}
          resizeMode="cover"
          style={{width: '100%', height: '100%'}}
        />
      </View>
      <View style={styles.listContainer}>
        {users.length !== 0 || refresh ? (
          <FlatList
            data={searchData === null ? users : searchData}
            renderItem={renderItem}
            keyExtractor={item => item._id}
          />
        ) : (
          <View
            style={{
              alignItems: 'center',
              padding: 50,
            }}>
            <Image
              source={require('../images/confused-shocked.gif')}
              style={{width: 90, height: 90}}
            />
            <Text style={styles.text}>
              It seems like there is no one nearby...
            </Text>
            <Text style={styles.text}>
              Try refreshing, or change your current city and refresh again!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1F21',
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: 'flex-end',
    height: '100%',
    width: '100%',
    // alignContent: 'flex-end',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    color: '#ffffff',
  },
  item: {
    backgroundColor: '#1E1F21',
    padding: 20,
  },
  listContainer: {
    flex: 0.77,
    width: '100%',
  },
});
export default Nearby;
