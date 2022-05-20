/*=========================
Type: Component

Description:
Allows user to change their current city location

=========================*/

//React Hook and Components
import React, {useState} from 'react';
import {View, Modal, StyleSheet} from 'react-native';

//Axios and Redux
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {updateUserCity} from '../features/auth/authSlice';

import {SERVER_IP} from '@env';

//Third Party Libraries
import {Button} from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';

//Async Storage

import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangeCityModal = ({modalVisible, setModalVisible}) => {
  //Redux auth state selector for user state
  const {user} = useSelector(state => state.auth);

  //State Hook for changing location based on user selection
  const [location, setLocation] = useState(user.City);

  //Array containing city names
  const CityArray = [
    {label: 'Beirut', value: 'Beirut'},
    {label: 'Tripoli', value: 'Tripoli'},
    {label: 'Sidon', value: 'Sidon'},
    {label: 'Tyre', value: 'Tyre'},
    {label: 'Jounieh', value: 'Jounieh'},
    {label: 'Byblos', value: 'Byblos'},
    {label: 'Aley', value: 'Aley'},
    {label: 'Nabatieh', value: 'Nabatieh'},
    {label: 'Baalbek', value: 'Baalbek'},
    {label: 'Zahle', value: 'Zahle'},
    {label: 'Zgharta-Ehden', value: 'Zgharta'},
    {label: 'Batroun', value: 'Batroun'},
  ];
  const dispatch = useDispatch();

  //Functions to modify local Storage Data
  const mergeData = async value => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.mergeItem('user', jsonValue);
      console.log('Merge DATA: ', jsonValue);
    } catch (e) {}
  };
  const getMyObject = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // read error
    }

    console.log('Done.');
  };

  //API call to change city of current user

  const updateCity = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const response = await axios.put(
      `http://${SERVER_IP}:8080/api/users/changeCity/${user._id}`,
      {City: location},
      config,
    );
    if (response.data) {
      console.log('DB DATA: ', response.data);
      mergeData(response.data);
      dispatch(updateUserCity(getMyObject()));
      console.log('Updated City:', user.City);
    }
    return response.data;
  };
  console.log(location);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Picker
            selectedValue={location}
            onValueChange={itemValue => setLocation(itemValue)}
            themeVariant="light">
            {CityArray.map(city => (
              <Picker.Item label={city.label} value={city.value} key={city} />
            ))}
          </Picker>

          <View style={styles.buttonDirections}>
            <View style={styles.cancelButton}>
              <Button
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                color="#FF0035"
                mode="contained">
                Cancel
              </Button>
            </View>
            <View style={styles.confirmButton}>
              <Button
                onPress={() => {
                  setModalVisible(!modalVisible);
                  updateCity();
                }}
                color="#5AFF15"
                mode="contained">
                Confirm
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    paddingLeft: 70,
    paddingRight: 70,
    flex: 0.3,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  buttonDirections: {
    flexDirection: 'row',
  },
  cancelButton: {
    paddingRight: 20,
  },
  confirmButton: {
    paddingRight: 20,
  },
});
export default ChangeCityModal;
