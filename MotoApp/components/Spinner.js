/*=========================
Type: Component

Description:
Spinner Component

=========================*/

import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

const Spinner = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FA8334" />
      <Text style={styles.text}>Making sure things are ready</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#1E1F21',
  },
  text: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    margin: 10,
    padding: 10,
  },
});
export default Spinner;
