/*=========================
Type: Component

Description:
Helper component for reading map markers set by user

=========================*/

import React from 'react';
import {StyleSheet, View} from 'react-native';

import MapView, {PROVIDER_GOOGLE, Polyline, Marker} from 'react-native-maps';

const MapRead = ({coordinates}) => {
  // const [coordinates] = useState([
  //   {
  //     latitude: coord[0].latitude,
  //     longitude: coord[0].longitude,
  //   },
  //   {
  //     latitude: coord[1].latitude,
  //     longitude: coord[1].longitude,
  //   },
  // ]);

  const renderMarkers = () => {
    return coordinates.map((location, i) => {
      if (i === 0) {
        return <Marker key={i} coordinate={location} pinColor="green" />;
      } else {
        return <Marker key={i} coordinate={location} />;
      }
    });
  };
  return (
    <View style={styles.body}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: coordinates[0].latitude,
          longitude: coordinates[0].longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.01,
        }}>
        {renderMarkers()}
        <Polyline
          coordinates={coordinates}
          strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
          strokeColors={['#7F0000']}
          strokeWidth={6}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height: 100,
  },
});

export default MapRead;
