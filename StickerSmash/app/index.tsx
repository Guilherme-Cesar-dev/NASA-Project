import React, { useState } from 'react';
import { View, Text, Image, Button, ActivityIndicator, StyleSheet, TextInput, Alert } from 'react-native';

const NASA_API_URL = 'https://api.nasa.gov/planetary/apod';
const API_KEY = '6tza6pa8QHVlDvVsAWMSyd3aWDpgPbyXaA205hNC';

const NasaApodImagePicker: React.FC = () => {
  const [date, setDate] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchImage = async () => {
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      Alert.alert('Data inválida', 'Use o formato YYYY-MM-DD');
      return;
    }
    setLoading(true);
    setImageUrl(null);
    setTitle(null);

    try {
      const response = await fetch(
        `${NASA_API_URL}?api_key=${API_KEY}&date=${date}`
      );
      const data = await response.json();
      if (data.media_type === 'image') {
        setImageUrl(data.url);
        setTitle(data.title);
      } else {
        setImageUrl(null);
        setTitle('Não há imagem para essa data');
      }
    } catch (error) {
      setImageUrl(null);
      setTitle('Erro ao buscar imagem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>NASA APOD - Escolha uma data</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />
      <Button title="Buscar Imagem" onPress={fetchImage} />
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {imageUrl && (
        <View style={styles.imageContainer}>
          <Text style={styles.title}>{title}</Text>
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
        </View>
      )}
      {!imageUrl && title && !loading && <Text style={styles.title}>{title}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: '#222' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#fff' },
  input: { borderWidth: 1, borderColor: '#555', backgroundColor: '#eee', borderRadius: 8, padding: 10, width: '80%', marginBottom: 10 },
  imageContainer: { marginTop: 20, alignItems: 'center' },
  image: { width: 300, height: 300, borderRadius: 10, backgroundColor: '#000' },
  title: { color: '#fff', marginVertical: 10, textAlign: 'center' },
});

export default NasaApodImagePicker;