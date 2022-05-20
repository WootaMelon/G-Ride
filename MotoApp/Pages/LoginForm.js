/*=========================
Type: Page

Description:
Login Page of the app that has input validation
=========================*/
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Alert,
  StatusBar,
} from 'react-native';
import {Text, Card, Button, Icon} from '@rneui/themed';
import {TextInput, HelperText} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {login, reset} from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
const LoginForm = ({navigation}) => {
  const [username, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  var helptext = '';
  const dispatch = useDispatch();
  const {user, isLoading, isError, isSuccess, message} = useSelector(
    state => state.auth,
  );
  useEffect(() => {
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigation, dispatch]);

  const lengthValidation = () => {
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (password.length < 8 && password.length != 0) {
      Alert.alert('Notice', 'Password must be a minimum of 8 characters', [
        {text: 'OK', style: 'destructive'},
      ]);
      return;
    }
    if (username.length === 0 || password.length === 0) {
      Alert.alert('Notice', 'All fields must be filled', [
        {text: 'OK', style: 'destructive'},
      ]);
      return;
    }
    if (format.test(username)) {
      Alert.alert(
        'Notice',
        'Please make sure that the username does not contain special characters',
        [{text: 'OK', style: 'destructive'}],
      );
      return;
    }
    const userInfo = {
      name: username,
      password: password,
    };
    dispatch(login(userInfo));
    setUserName('');
    setPassword('');
  };
  const hasErrors = () => {
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(username))
      helptext =
        'Make sure that the username does not contain special characters';
    return format.test(username);
  };
  if (isError) {
    Alert.alert('Notice', 'Invalid Credentials', [
      {text: 'OK', style: 'destructive'},
    ]);
  }
  if (isLoading) {
    return <Spinner />;
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require('../images/biker.jpg')}
        resizeMode="cover"
        style={styles.image}>
        <Card>
          <Card.Title>
            <Text h4>Login</Text>
          </Card.Title>
          <Card.FeaturedTitle>
            <Text style={styles.text}>Username:</Text>
          </Card.FeaturedTitle>
          <TextInput
            style={styles.inputText}
            activeUnderlineColor="green"
            placeholder="Please Enter Your Username"
            clearButtonMode={'while-editing'}
            value={username}
            onChangeText={text => setUserName(text)}
            blurOnSubmit
          />
          <HelperText type="error" visible={hasErrors()} padding="none">
            {helptext}
          </HelperText>

          <Card.FeaturedTitle>
            <Text style={styles.text}>Password:</Text>
          </Card.FeaturedTitle>
          <TextInput
            style={styles.inputText}
            activeUnderlineColor="green"
            placeholder="Please Enter Your Password"
            secureTextEntry={true}
            clearButtonMode={'while-editing'}
            blurOnSubmit
            value={password}
            onChangeText={pass => setPassword(pass)}
          />

          <Card.Divider />

          <Button
            containerStyle={{margin: 10, padding: 10, width: 300}}
            buttonStyle={{backgroundColor: 'black'}}
            title="Login"
            type="solid"
            icon="home"
            disabled={hasErrors()}
            onPress={() => lengthValidation()}
          />
          <Text style={{textAlign: 'center', fontSize: 12}}>
            New to the app?{' '}
            <Text
              style={{color: '#0492C2'}}
              onPress={() => navigation.navigate('Register')}>
              Register Here
            </Text>
          </Text>
        </Card>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignContent: 'center'},
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  inputText: {
    fontSize: 13,
    padding: 10,
    height: 20,
    backgroundColor: 'white',
  },
});

export default LoginForm;
