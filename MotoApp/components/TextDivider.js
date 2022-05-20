/*=========================
Type: Component

Description:
Custom Text Divide Component

=========================*/
import React from 'react';
import {StyleSheet, View} from 'react-native';
const TextDivider = () => {
  return <View style={styles.Divider} />;
};
const styles = StyleSheet.create({
  Divider: {
    borderBottomColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 50,
    marginRight: 20,
  },
});

export default TextDivider;
