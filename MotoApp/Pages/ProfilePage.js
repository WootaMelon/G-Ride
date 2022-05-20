/*=========================
Type: Page

Description:
Profile Page of the current logged in user where they can view their subscriptions, garage as well as change their
Current City
=========================*/

import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import {Button} from 'react-native-paper';
import ProfileAvatar from '../components/ProfileAvatar';
import {useDispatch, useSelector} from 'react-redux';
import {logout, reset} from '../features/auth/authSlice';
import TextDivider from '../components/TextDivider';
import ChangeCityModal from '../components/ChangeCityModal';
import Icon from 'react-native-vector-icons/FontAwesome';
const ProfilePage = ({navigation}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const [modalVisible, setModalVisible] = useState(false);

  const onLogout = () => {
    console.log('Logged out');
    dispatch(logout());
    dispatch(reset());
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <ProfileAvatar />

        <View style={{flex: 0.5, justifyContent: 'center'}}>
          <Text style={styles.text}>{user.name}</Text>
        </View>
      </View>
      {/* <Garage /> */}
      <View style={styles.textContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ViewSubscriptions')}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              size={24}
              color="white"
              name="bars"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>View Subscriptions</Text>
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
        <TextDivider />
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              size={24}
              color="white"
              name="location-arrow"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>Change City</Text>
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
        <TextDivider />
        <TouchableOpacity onPress={() => navigation.navigate('Garage',{userID: user._id})}>
          <View style={{flexDirection: 'row'}}>
            <Icon
              size={24}
              color="white"
              name="motorcycle"
              style={styles.optionIcon}
            />
            <Text style={styles.optionText}>My Garage</Text>
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
      <Button
        onPress={onLogout}
        labelStyle={{color: 'black'}}
        mode="contained"
        color="#FF0035"
        style={{alignSelf: 'center'}}>
        Logout
      </Button>
      {modalVisible ? (
        <ChangeCityModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      ) : (
        <></>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  safeView: {flex: 1, backgroundColor: '#1E1F21'},
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#383838',
    marginTop: 30,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
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
export default ProfilePage;
