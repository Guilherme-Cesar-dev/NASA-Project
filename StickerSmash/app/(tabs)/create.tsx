import { View, Text, Image, StyleSheet, TextInput, Pressable, } from 'react-native';
import React, { useState } from 'react';

export default function RootLayout() {

const create = async () => {

}

const aleatorio = async () => {

}

return (
    <View style={styles.container}>
        <TextInput style={styles.input} placeholder='YYYY-MM-DD'></TextInput>
        <TextInput style={styles.input} placeholder='Autor'></TextInput>
        <TextInput style={styles.input} placeholder='Title'></TextInput>
        <TextInput style={styles.input} placeholder='D'></TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5',},
    input: { backgroundColor: 'gray', padding: 3, margin: 4, color: 'white' , borderRadius: 5, borderColor: 'black', borderWidth: 1,},

});