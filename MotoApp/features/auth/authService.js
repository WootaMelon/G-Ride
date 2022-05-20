/*=========================
Type: Feature - Auth

Description:
Auth Service for simplifying API calls through redux

=========================*/
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SERVER_IP} from '@env';
import axios from 'axios';

const API_URL = `http://${SERVER_IP}:8080/api/users/`;

const storeData = async value => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('user', jsonValue);
  } catch (e) {
    // saving error
  }
};
const removeValue = async () => {
  try {
    await AsyncStorage.removeItem('user');
  } catch (e) {
    console.trace(`Error: ${e} | while removing user from async storage`);
  }

  console.log('Done.');
};

const register = async userData => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    storeData(response.data);
  }
  return response.data;
};
const login = async userData => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    storeData(response.data);
    // console.log(response.data);
  }
  return response.data;
};

const logout = () => {
  removeValue();
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
