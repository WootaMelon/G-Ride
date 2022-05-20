/*=========================
Type: Page

Description:
Register Page of the app that has input validation
=========================*/
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Alert,
  StatusBar,
} from 'react-native';
import {Text, Card, Button} from '@rneui/themed';
import {useDispatch, useSelector} from 'react-redux';
import {register, reset} from '../features/auth/authSlice';
import Spinner from '../components/Spinner';
import {TextInput, HelperText} from 'react-native-paper';

const RegisterForm = ({navigation}) => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');

  var helptext = '';
  const dispatch = useDispatch();
  const {user, isLoading, isError, isSuccess, message} = useSelector(
    state => state.auth,
  );
  useEffect(() => {
    if (isError) {
      console.log('Error from useEffect');
    }
    if (isSuccess || user) {
      console.log('Sucess from useEffect');
      navigation.navigate('Profile');
    }

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

    dispatch(register(userInfo));
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
    Alert.alert('Notice', 'Username is already taken', [
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
            <Text h4>Register</Text>
          </Card.Title>
          <Card.FeaturedTitle>
            <Text style={styles.text}>Username:</Text>
          </Card.FeaturedTitle>
          <TextInput
            style={styles.inputText}
            activeUnderlineColor="green"
            placeholder="Please Enter a Username"
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
            placeholder="Please Enter a Password"
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
            title="Register"
            type="solid"
            icon="home"
            disabled={hasErrors()}
            onPress={() => lengthValidation()}
          />
          <Text style={{textAlign: 'center', fontSize: 12}}>
            Already a user?{' '}
            <Text
              style={{color: '#0492C2'}}
              onPress={() => navigation.navigate('Login')}>
              Login Here
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

export default RegisterForm;
