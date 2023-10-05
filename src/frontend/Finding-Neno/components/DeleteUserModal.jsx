import { FormControl, HStack, Input, View } from 'native-base';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Modal, Portal, Text } from 'react-native-paper';
import { Color } from './atomic/Theme';

const DeleteUserModal = ({ visible, setVisible }) => {
    const deleteUser = () => {}



    return (
        <Portal>
            <Modal style={styles.modal} visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.container}>
                <Text style={{ fontWeight: 'bold', fontSize: '20' }}>Delete Account</Text>
                <Text>Are you sure you want to delete your account? You cannot undo this action.</Text>

                <FormControl>

                </FormControl>
                <Text>Confirm this is you</Text>
                <Input placeholder='Enter your password'></Input>

                <HStack>
                    <Button mode='outlined' textColor={Color.NENO_BLUE} style={{ borderColor: Color.NENO_BLUE }} onPress={() => setVisible(false)}>Cancel</Button>
                    <Button mode='contained' buttonColor='red' onPress={() => setVisible(false)}>Delete Account</Button>
                </HStack>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modal: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    container: {
        width: '60%',
        height: '40%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 20
    }
});

export default DeleteUserModal;
