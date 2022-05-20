import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  Button,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from './Spinner';
import {Card, Title, Paragraph} from 'react-native-paper';
import {SERVER_IP} from '@env';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import {white} from 'colors';

const Garage = ({route}) => {
  const API_URL = `http://${SERVER_IP}:8080/api/users/updateGarage/`;
  const {user} = useSelector(state => state.auth);

  const [userGarage, setUserGarage] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [gear, setGear] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  //============================================================
  // LOGIC TO UPLOAD IMAGE
  const pickImage = itemtype => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
      cropperCircleOverlay: true,
      mediaType: 'photo',
    })
      .then(picture => {
        setIsUploading(true);
        uploadImage(picture.path, itemtype);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const uploadImage = (imagePath, itemtype) => {
    const formData = new FormData();
    formData.append('GarageItem', {
      name: new Date() + '_profile',
      uri: imagePath,
      type: 'image/jpeg',
    });
    formData.append('Itemtype', itemtype);
    console.log('ITEM TYPE FROM UPLOAD', itemtype);

    const uploadGarageItem = async GarageItem => {
      await fetch(API_URL + user._id, {
        method: 'PUT',
        body: GarageItem,
      })
        .then(data => {
          setIsUploading(false);
          console.trace('Image Uploaded.');
        })
        .catch(err => console.trace(err));
    };
    uploadGarageItem(formData);
  };

  //============================================================
  // LOGIC TO GET GARAGE

  useEffect(() => {
    const sortGarageItems = () => {
      setBikes(userGarage.filter(item => item.Itemtype === 'bike'));
      setGear(userGarage.filter(item => item.Itemtype === 'gear'));
    };
    const getGarageItems = async userID => {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      try {
        const response = await axios.get(
          `http://${SERVER_IP}:8080/api/users/getGarageItems/${userID}`,
          config,
        );
        if (response.data) {
          for (let x = 0; x < response.data.length; x++) {
            userGarage.push(response.data[x]);
          }
          setIsLoading(false);
          return response.data;
        }
      } catch (err) {
        console.trace(err);
      }
    };

    getGarageItems(route.params.userID);

    sortGarageItems();
  }, [isLoading, route.params.userID, user.token, userGarage]);

  //============================================================
  // LOGIC TO DELETE GARAGE

  const deleteGarageItem = async itemID => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    try {
      const response = await axios.delete(
        `http://${SERVER_IP}:8080/api/users/deleteGarageItem/${itemID}`,
        config,
      );
      if (response.data) {
        // console.log(userGarage)
        return response.data;
      }
    } catch (err) {
      console.trace(err);
    }
  };

  // GARAGE ITEM CARD COMPONENT
  const Item = ({itemID, itemtype, image, isAddImageCard}) => {
    const [showItem, setShowItem] = useState(true);
    if (!showItem) {
      return <></>;
    }
    return (
      <View style={styles.garageItemCard}>
        {!isAddImageCard ? (
          <>
            <Image
              style={styles.garageItemCardAvatar}
              source={{
                uri: image,
              }}
            />
            {user._id === route.params.userID ? (
              <TouchableOpacity
                onPress={() => {
                  deleteGarageItem(itemID);
                  setShowItem(false);
                }}
                style={styles.deleteIcon}>
                <Icon name="remove" color="#FF0034" size={30}></Icon>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            {user._id === route.params.userID ? (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  pickImage(itemtype);
                }}>
                <Text style={styles.plusSign}>+</Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </>
        )}
      </View>
    );
  };
  const renderBike = ({item}) => (
    <Item
      itemID={item._id}
      itemtype="bike"
      image={item.image}
      isAddImageCard={item.isAddImageCard}
    />
  );

  const renderGear = ({item}) => (
    <Item
      itemID={item._id}
      itemtype="gear"
      image={item.image}
      isAddImageCard={item.isAddImageCard}
    />
  );

  if (isUploading) {
    return <Spinner />;
  }
  return (
    <View style={styles.mainContainer}>
      <ImageBackground
        source={require('../images/Garage_Background.jpg')}
        resizeMode="cover">
        <View style={styles.backgroundFade}>
          <View style={{flex: 0.4}}>
            <Title style={styles.garageTitle}>Bikes</Title>
            <FlatList
              data={[...bikes, {isAddImageCard: true}]}
              renderItem={renderBike}
              keyExtractor={item => item._id}
              numColumns={2}
              nestedScrollEnabled
            />
          </View>
          <View style={{flex: 0.5}}>
            <Title style={styles.garageTitle}>Gear</Title>

            <FlatList
              data={[...gear, {isAddImageCard: true}]}
              renderItem={renderGear}
              keyExtractor={item => item._id}
              numColumns={2}
              nestedScrollEnabled
            />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'black',
    flex: 1,
  },
  garageItemCard: {
    width: '50%',
    aspectRatio: 1 / 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    padding: 20,
    borderRadius: 20,
  },
  garageItemCardAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  addButton: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: 'rgba(150,150,150,0.7)',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusSign: {
    fontSize: 60,
  },
  deleteIcon: {
    position: 'absolute',
    top: '10%',
    right: '10%',
  },
  garageTitle: {
    color: 'white',
    padding: 10,
    margin: 10,
    fontSize: 30,
  },
  backgroundFade: {
    width: '90%',
    height: '100%',
    margin: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    alignSelf: 'center',
  },
});

export default Garage;
