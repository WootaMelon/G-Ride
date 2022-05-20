/*=========================
Type: Component

Description:
Component for changing and displaying user avatar

=========================*/

import {Avatar} from '@rneui/themed';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {SERVER_IP} from '@env';

const API_URL = `http://${SERVER_IP}:8080/api/users/updateAvatar/`;
// const GroupAvatar_URL = `http://${SERVER_IP}:8080/api/groupRides/avatar/`;
const ProfileAvatar = ({navigation}) => {
  const {user} = useSelector(state => state.auth);

  const [image, setImage] = useState(
    'https://res.cloudinary.com/dp1ppfi7c/image/upload/c_scale,w_256/v1651452445/biker_vwjaxx.jpg',
  );
  const [refresh, setRefresh] = useState(false);

  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      mediaType: 'photo',
    })
      .then(picture => {
        console.log(picture);
        setImage(picture.path);
        setRefresh(true);
        uploadImage(picture.path);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const uploadImage = imagePath => {
    const formData = new FormData();
    formData.append('avatar', {
      name: new Date() + '_profile',
      uri: imagePath,
      type: 'image/jpg',
    });

    const uploadAvatar = async avatar => {
      await fetch(API_URL + user._id, {
        method: 'PUT',
        body: avatar,
      }).then(data => {
        // console.log(data);
        saveAvatar();
      });
    };
    uploadAvatar(formData);
  };
  const saveAvatar = () => {
    const mergeData = async value => {
      try {
        const jsonValue = JSON.stringify(value);
        // console.log(jsonValue);
        await AsyncStorage.mergeItem('user', jsonValue);
      } catch (e) {}
    };
    const storeUpdatedUser = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get(
        `http://${SERVER_IP}:8080/api/users/me`,
        config,
      );
      if (response.data) {
        mergeData(response.data);
        // console.log(response.data.avatar);
        const groupAvatarUpdateRequest = await axios.put(
          `http://${SERVER_IP}:8080/api/groupRides/avatar/${user._id}`,
          {riderProfile: response.data.avatar},
          config,
        );
        if (groupAvatarUpdateRequest.data) {
        }
      }
      return response.data;
    };

    storeUpdatedUser();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => pickImage()}>
        <ImageBackground>
          {user.avatar !== '' && !refresh ? (
            <Avatar size={84} rounded source={{uri: user.avatar}} />
          ) : (
            <Avatar size={84} rounded source={{uri: image}} />
          )}
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 0.3,
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
  },
  profilePhotoTextPosition: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 25,
    bottom: 0,
    justifyContent: 'center',
  },
  profilePhotoText: {
    color: 'white',
    fontSize: 9,
    alignSelf: 'center',
    width: 60,
    height: 10,
  },
});
export default ProfileAvatar;
