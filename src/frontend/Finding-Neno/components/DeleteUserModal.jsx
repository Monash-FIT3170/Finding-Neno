import { FormControl, Modal, HStack, Icon, Input, Pressable, View, WarningOutlineIcon, useToast } from 'native-base';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'
import { Button, Portal, Text } from 'react-native-paper';
import { Color } from './atomic/Theme';
import { useSelector } from 'react-redux';
import store from "../store/store";
import { logout } from '../store/user';
import { useTheme } from '@react-navigation/native';

const DeleteUserModal = ({ visible, setVisible }) => {
    const { API_URL } = useSelector((state) => state.api)
    const { USER_ID, ACCESS_TOKEN } = useSelector((state) => state.user);

    const [formData, setFormData] = useState({ 
        password: '' 
    });
    const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
    const toast = useToast();
    const { colors } = useTheme();

    const closeModal = () => {
        setVisible(false);
        setFormData({ password: '' });
        setErrors({});
        console.log(errors)
    }

    const deleteUser = async () => {
		let isValid = await validateDetails(formData);

        if (isValid) {
            // Send request to delete user.
            fetch(`${API_URL}/delete_user`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'User-ID': USER_ID
                },
                body: JSON.stringify({
                    toDeleteId: USER_ID,
                    password: formData.password
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data[0] === "Success") {
                        toast.show({
                            title: 'Account Deleted',
                            status: 'success',
                            description: 'Your account has been deleted.',
							placement: 'top'
                        });
                        store.dispatch(logout());
                    } else {
                        toast.show({
                            title: 'Error',
                            status: 'error',
                            description: data.message,
							placement: 'top'
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

    }
    
    const validateDetails = async (formData) => {
        // Validates details.
        foundErrors = {};

        if (!formData.password || formData.password == "") {
            foundErrors = { ...foundErrors, password: 'Password confirmation is required to delete your account.' }
        }
        else {
            const correctPassword = await validatePassword(formData.password); 
            
            if (!correctPassword) { 
                foundErrors = { ...foundErrors, password: 'Password is incorrect.' }
            }
        }

        setErrors(foundErrors);

        // true if no errors (foundErrors = 0), false if errors found (foundErrors > 0)
        return Object.keys(foundErrors).length === 0;
    }

    const validatePassword = async (password) => {
        try {
            const url = `${API_URL}/validate_password`;
            const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
                "User-ID": USER_ID,
            },
            body: JSON.stringify({
                toCheckId: USER_ID,
                password: password,
            }),
            });

            const data = await response.json();
            const valid = data[0];
            return valid;
        } catch (error) {
            console.error(error);
        }
    };

    const styles = StyleSheet.create({
        modal: {
            width: '100%',
            height: '100%',
            alignItems: 'center',
        },
        container: {
            backgroundColor: colors.background,
            padding: 20,
            borderRadius: 20
        },
    });

    return (
        <Modal isOpen={visible} onClose={closeModal} size={"md"}>
          <Modal.Content backgroundColor={colors.background}>
                <Modal.CloseButton _icon={{color: colors.text}} />
                <Modal.Header _text={{color: colors.text}} backgroundColor={colors.background} borderColor={colors.border}>Delete Account</Modal.Header>
                <Modal.Body>
                    <Text style={{ color: colors.text, marginTop: 4 }}>Are you sure you want to delete your account? You cannot undo this action.</Text>

                    <FormControl isInvalid={'password' in errors}>
                        <FormControl.Label><Text fontWeight={500} color={colors.text}>Confirm this is you</Text></FormControl.Label>
                        <Input _input={{selectionColor: colors.primary}} selectionColor={colors.primary} color={colors.text} placeholder='Password' type={showPassword ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShowPassword(!showPassword)}>
                        <Icon as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                        </Pressable>} onChangeText={value => setFormData({...formData, password: value})} />
                        {'password' in errors && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>{errors.password}</FormControl.ErrorMessage>}
                    </FormControl>
                </Modal.Body>
                <Modal.Footer borderColor={colors.border} backgroundColor={colors.background}>
                    <Button mode='outlined' textColor={Color.NENO_BLUE} style={{ borderColor: Color.NENO_BLUE, width: 100 }} onPress={closeModal}>Cancel</Button>
                    <Button mode='contained' textColor='white' buttonColor='red' style={{ marginLeft: 4, width: 100 }} onPress={deleteUser}>Delete</Button>
                </Modal.Footer>
          </Modal.Content>
        </Modal>
    );
};

export default DeleteUserModal;
