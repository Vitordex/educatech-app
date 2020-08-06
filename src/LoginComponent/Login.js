import axios from 'axios';
import React from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { TextInput, Button, Snackbar, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers';
import loginSchema from './LoginSchema';

import { API_ENDPOINT } from '@env';

const baseUrl = `${API_ENDPOINT}/api`;

export default function Login({ navigation }) {
    const { handleSubmit, control, errors } = useForm({
        resolver: joiResolver(loginSchema, { abortEarly: false })
    });
    const onSubmit = (data) => submitLogin(data.email, data.password);

    const [snackBarText, setSnackBarText] = React.useState('');
    const [visible, setVisible] = React.useState(false);

    async function submitLogin(email, password) {
        let res;

        try {
            res = await axios.post(`${baseUrl}/users/v1/login`, { email, password }, {});
        } catch (error) {
            const { status } = error.response || {};

            let snackText = '';
            switch (status) {
                case 404:
                case 401:
                case 400:
                    snackText = 'Verifique seu e-mail e senha';
                    break;
                case 500:
                case 502:
                    snackText = 'Estamos com problemas para processar o seu login. Por favor aguarde';
                    break; s
                default:
                    snackText = 'Houve um erro';
                    break;
            }

            setSnackBarText(snackText);
            setVisible(!visible);
            return;
        }

        const { data } = res;
        const { token, user } = data;

        try {
            await Promise.all([
                AsyncStorage.setItem('token', token),
                AsyncStorage.setItem('user', JSON.stringify(user))]);
        } catch (error) {
            setSnackBarText('Houve um erro ao entrar. Tente novamente');
            setVisible(!visible);
            return;
        }

        navigation.navigate('Home');
    }

    const onDismissSnackBar = () => setVisible(false);

    return (
        <View>
            <Controller
                control={control}
                render={({ onChange, onBlur, value }) => (
                    <TextInput
                        style={styles.element}
                        label="E-mail"
                        error={errors.email}
                        onEndEditing={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value} />
                )}
                name="email"
                defaultValue=""
            />
            {errors.email?.type === 'string.empty' &&
                <Text style={styles.errorElement}>Insira um e-mail.</Text>}
            {errors.email?.type === 'string.email' &&
                <Text style={styles.errorElement}>Insira um e-mail válido.</Text>}

            <Controller
                control={control}
                render={({ onChange, onBlur, value }) => (
                    <TextInput
                        style={styles.element}
                        label="Senha"
                        secureTextEntry={true}
                        value={value}
                        error={errors.password}
                        onEndEditing={onBlur}
                        onChangeText={value => onChange(value)} />
                )}
                name="password"
                defaultValue="" />
            {errors.password?.type === 'string.empty' &&
                <Text style={styles.errorElement}>Insira uma senha.</Text>}
            {errors.password?.type === 'string.min' &&
                <Text style={styles.errorElement}>A senha deve conter no minimo 8 caracteres.</Text>}
            {errors.password?.type === 'string.pattern.name' &&
                <Text style={styles.errorElement}>
                    {errors.password.message.includes('special pattern') && 'A senha deve contar ao menos um caracter especial.'}
                    {errors.password.message.includes('uppercase pattern') && 'A senha deve contar ao menos uma letra maiúscula.'}
                    {errors.password.message.includes('lowercase pattern') && 'A senha deve contar ao menos uma letra minúsculo.'}
                    {errors.password.message.includes('number pattern') && 'A senha deve contar ao menos um número.'}
                </Text>}
            <Button
                style={styles.element}
                mode="contained"
                onPress={handleSubmit(onSubmit)}>Enviar</Button>
            <Snackbar
                visible={visible}
                onDismiss={onDismissSnackBar}
                action={{
                    label: 'Fechar',
                    onPress: () => { }
                }}>
                {snackBarText}
            </Snackbar>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    element: {
        marginBottom: 16,
        marginHorizontal: 16
    },
    errorElement: {
        marginBottom: 16,
        marginHorizontal: 16
    }
});
