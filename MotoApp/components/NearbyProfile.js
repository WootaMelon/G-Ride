/*=========================
Type: Component

Description:
Component for seeing other user's profile

=========================*/

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import {Avatar} from '@rneui/themed';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {SERVER_IP} from '@env';

const NearbyProfile = ({route, navigation}) => {
  const {user} = useSelector(state => state.auth);
  // const [isLoading, setIsLoading] = useState(true);
  const [nearbyUser, setNearbyUser] = useState(true);
  const [image, setImage] = useState(
    `https://res.cloudinary.com/dp1ppfi7c/image/upload/c_scale,w_256/v1651452445/biker_vwjaxx.jpg`,
  );

  useEffect(() => {
    const getUserByID = async userID => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios
        .get(`http://${SERVER_IP}:8080/api/users/getUserByID/${userID}`, config)
        .then(res => {
          setNearbyUser(res.data);
        })
        .catch(err => {
          console.log(err);
        });
    };
    console.log(route.params.id);
    getUserByID(route.params.id);
  }, [route.params.id, user.token]);

  // if (isLoading) {
  //   return <Spinner />;
  // }

  return (
    <SafeAreaView style={styles.safeView}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={{flex: 0.3}}>
          <ImageBackground>
            {nearbyUser.avatar !== '' ? (
              <Avatar size={84} rounded source={{uri: nearbyUser.avatar}} />
            ) : (
              <Avatar size={84} rounded source={{uri: image}} />
            )}
          </ImageBackground>
        </View>

        <View
          style={{
            margin: 10,
            flex: 1,
            justifyContent: 'center',
            paddingTop: 75,
          }}>
          <Text style={styles.text}>{nearbyUser.name}</Text>
          <Text style={styles.Citytext}>{nearbyUser.City}</Text>
        </View>
      </View>
      {/* <Garage /> */}
      <View style={styles.textContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Garage', {userID: route.params.id})
          }>
          <View style={{flexDirection: 'row'}}>
            <Icon
              size={24}
              color="white"
              name="motorcycle"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>User Garage</Text>
            <View style={{flex: 1, margin: 5}}>
              <Icon
                size={16}
                color="white"
                name="chevron-right"
                style={styles.chevron}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeView: {flex: 1, backgroundColor: '#1E1F21'},
  container: {
    // flexDirection: 'row',
    padding: 10,
    height: 200,
    backgroundColor: '#383838',
    marginTop: 30,
    alignItems: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    lineHeight: 20,
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  Citytext: {
    fontSize: 14,
    lineHeight: 20,
    paddingTop: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  textContainer: {
    backgroundColor: '#383838',
    marginTop: 50,
    marginBottom: 50,
    borderBottomColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  optionIcon: {
    padding: 15,
    alignSelf: 'center',
  },
  chevron: {
    padding: 15,
    alignSelf: 'flex-end',
  },
  optionText: {
    fontSize: 14,
    lineHeight: 25,
    fontWeight: 'bold',
    textAlign: 'left',
    color: 'white',
    padding: 15,
  },

  item: {
    padding: 10,
  },
});
export default NearbyProfile;
