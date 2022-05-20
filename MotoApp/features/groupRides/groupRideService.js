/*=========================
Type: Feature - Auth

Description:
groupRide Service for simplifying API calls through redux

=========================*/

import axios from 'axios';
import {SERVER_IP} from '@env';

const API_URL = `http://${SERVER_IP}:8080/api/groupRides/`;

const createGroupRide = async (groupRideData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, groupRideData, config);

  return response.data;
};

const getGroupRides = async token => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);

  return response.data;
};

const deleteGroupRide = async (groupRideId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(API_URL + groupRideId, config);

  return response.data;
};

const updateGroupRide = async (groupRideData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(
    API_URL + groupRideData.rideID,
    groupRideData,
    config,
  );

  return response.data;
};
const groupRideService = {
  createGroupRide,
  getGroupRides,
  deleteGroupRide,
  updateGroupRide,
};
export default groupRideService;
