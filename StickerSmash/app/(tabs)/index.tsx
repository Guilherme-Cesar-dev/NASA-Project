import { View, Text, Image, StyleSheet, TextInput, Pressable, } from 'react-native';
import React, { useState } from 'react';

const API_URL = 'https://api.nasa.gov/planetary/apod';
const API_KEY = '6tza6pa8QHVlDvVsAWMSyd3aWDpgPbyXaA205hNC';


export default function RootLayout() {

const [date, setDate] = useState('');
const [image, setImage] = useState(null);
const [title, setTitle] = useState();
const [description, setDescription] = useState(null);
const [dateE, setDateE] = useState(null);

const pesquisa = async () => {

    const lolo = await fetch(`${API_URL}?api_key=${API_KEY}&date=${date}`);

    const lol = await lolo.json();

    setImage(lol.url);
    setTitle(lol.title);
    setDescription(lol.explanation);
    setDateE(lol.date);

}

const aleatorio = async () => {

  let num1 =  Math.floor(Math.random() * (2025 - 1995) + 1995);
  let num2 =  Math.floor(Math.random() * (12 - 1) + 1);
  let num3 =  Math.floor(Math.random() * (31 - 1) + 1);
  
  setDate(num1+'-'+num2+'-'+num3);

  console.log(date)
}

  return (
    <View style={styles.container}>
      <Text style={styles.title_page}>NASA_APOD</Text>
      <Text style={styles.subTitle}>API picture of day</Text>

      {/**Input de data, botao de pesquisa e data aleatoria*/}
      <TextInput style={styles.input} placeholder='YYYY-MM-DD' value={date} onChangeText={setDate}></TextInput>
      <Pressable onPress={pesquisa} style={styles.buttonSearch}>SEARCH IMAGE</Pressable>
      <Pressable onPress={aleatorio} style={styles.buttonSuprise}>ALEATORY DAY</Pressable>
      
      {/**Titulo, Imagem e Descrição da data pesquisada*/}
      <Text style={styles.title}>{title} - {dateE}</Text>
      <Image source={{uri : image}} style={styles.image}></Image>
      <Text style={styles.description}>{description}</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5',},
  title_page: { color: 'black', fontSize: 20,},
  subTitle: { color: 'black', fontSize: 10,},
  input: { backgroundColor: 'gray', padding: 3, margin: 4, color: 'white' , borderRadius: 5, borderColor: 'black', borderWidth: 1,},
  buttonSearch: { backgroundColor: '#008f15ff', color: 'white', margin: 4, padding: 2, borderRadius: 4},
  buttonSuprise: { backgroundColor: '#006ca6ff', color: 'white', margin: 2, padding: 2, borderRadius: 4},
  title: { color: 'black', fontSize: 12, fontFamily: 'cursive', padding: 5},
  image: { width: 300, height: 300, padding: 5}, 
  description: { color: 'gray', fontSize: 8, width: 700, padding: 4},
});