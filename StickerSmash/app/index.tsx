import React, { useState } from "react";
import { Text, View, TextInput, Button, Image, StyleSheet, ActivityIndicator, ScrollView } from "react-native";

export default function Index() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pokemon, setPokemon] = useState<any>(null);
  const [error, setError] = useState("");
  const [evolutions, setEvolutions] = useState<{ name: string; sprite: string }[]>([]);
  const [typePokemons, setTypePokemons] = useState<{ name: string; sprite: string }[]>([]);

  const fetchPokemon = async () => {
    if (!search.trim()) {
      setError("Digite o nome, id ou tipo do Pokémon.");
      setPokemon(null);
      setEvolutions([]);
      setTypePokemons([]);
      return;
    }
    setLoading(true);
    setError("");
    setPokemon(null);
    setEvolutions([]);
    setTypePokemons([]);

    // Tenta buscar como Pokémon
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`);
      if (res.ok) {
        const data = await res.json();
        setPokemon(data);

        // Buscar evoluções
        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();
        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        // Função para extrair todos os nomes da cadeia de evolução
        const getEvolutions = (chain: any): string[] => {
          const names: string[] = [];
          const traverse = (node: any) => {
            names.push(node.species.name);
            node.evolves_to.forEach((evo: any) => traverse(evo));
          };
          traverse(chain);
          return names;
        };

        const evoNames = Array.from(new Set(getEvolutions(evoData.chain))); // remove duplicados

        // Buscar sprites das evoluções
        const evoSprites: { name: string; sprite: string }[] = [];
        for (const name of evoNames) {
          try {
            const evoRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const evoData = await evoRes.json();
            evoSprites.push({
              name,
              sprite: evoData.sprites.front_default,
            });
          } catch {
            evoSprites.push({
              name,
              sprite: "",
            });
          }
        }

        setEvolutions(evoSprites);
        setLoading(false);
        return;
      }
    } catch {}

    // Se não achou como Pokémon, tenta buscar como tipo
    try {
      const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${search.toLowerCase()}`);
      if (!typeRes.ok) throw new Error("Pokémon ou tipo não encontrado");
      const typeData = await typeRes.json();
      const pokemons = typeData.pokemon.map((p: any) => p.pokemon.name);

      // Buscar sprites dos pokémons do tipo
      const typeSprites: { name: string; sprite: string }[] = [];
      for (const name of pokemons.slice(0, 20)) { // Limita para não ficar pesado
        try {
          const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          const pokeData = await pokeRes.json();
          typeSprites.push({
            name,
            sprite: pokeData.sprites.front_default,
          });
        } catch {
          typeSprites.push({
            name,
            sprite: "",
          });
        }
      }
      setTypePokemons(typeSprites);
    } catch (err: any) {
      setError("Pokémon ou tipo não encontrado");
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1200px-International_Pok%C3%A9mon_logo.svg.png'}} style={styles.poketitle}></Image>
      <Text style={styles.title}>Buscar Pokémon</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder=". . ."
          value={search}
          onChangeText={setSearch}
        />
        <Button title="Buscar" onPress={fetchPokemon} />
      </View>
      {loading && <ActivityIndicator size="large" color="#2196f3" />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.resultContainer}>
        {pokemon && (
          <View style={styles.pokemonContainer}>
            <Image
              source={{ uri: pokemon.sprites.front_default }}
              style={styles.image}
            />
            <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
            <Text style={styles.subtitle}>Ataques:</Text>
            {pokemon.moves.slice(0, 5).map((move: any, idx: number) => (
              <Text key={idx} style={styles.move}>
                {move.move.name}
              </Text>
            ))}
          </View>
        )}
        {evolutions.length > 0 && (
          <View style={styles.evolutionContainer}>
            <Text style={styles.subtitle}>Evoluções:</Text>
            {evolutions.map((evo, idx) => (
              <View key={idx} style={styles.evoRow}>
                {evo.sprite ? (
                  <Image source={{ uri: evo.sprite }} style={styles.evoImage} />
                ) : null}
                <Text style={styles.evolution}>
                  {evo.name.charAt(0).toUpperCase() + evo.name.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        )}
        {typePokemons.length > 0 && (
          <View style={styles.typeContainer}>
            <Text style={styles.subtitle}>Pokémons do tipo "{search.toLowerCase()}":</Text>
            {typePokemons.map((poke, idx) => (
              <View key={idx} style={styles.evoRow}>
                {poke.sprite ? (
                  <Image source={{ uri: poke.sprite }} style={styles.evoImage} />
                ) : null}
                <Text style={styles.evolution}>
                  {poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", justifyContent: "center", padding: 20, backgroundColor: "#000", backgroundImage: `url(https://media.discordapp.net/attachments/1327793897979641977/1428096645056430280/hero-img.png?ex=68f14224&is=68eff0a4&hm=a761b73326dd94f2d48206134933438a0f87b2bb22ab67b475124a18c4f94c19&=&format=webp&quality=lossless&width=1089&height=446)`, backgroundSize:1200, backgroundPosition: 'center', backgroundRepeat: 'no-repeat'},
  poketitle: { width: 384, height: 140, marginBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#ffffffff"},
  searchContainer: { flexDirection: "row", marginBottom: 20, alignItems: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 8, width: 300, marginRight: 10, color: "white", backgroundColor: '#000'},
  error: { color: "red", marginBottom: 10 },
  resultContainer: { flexDirection: "row", justifyContent: "center", alignItems: "flex-start", width: "100%"},
  pokemonContainer: { alignItems: "center", marginTop: 20, marginRight: 30, backgroundColor: '#00172cff', padding: 12, borderRadius: 10, borderColor: "#005aaeff", borderWidth: 3 },
  image: { width: 120, height: 120, marginBottom: 10, borderRadius: 8, backgroundColor: "#c3c3c3ff" },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#ffffffff"},
  subtitle: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#fff" },
  move: { fontSize: 14, marginBottom: 2, color: "#00e1ffff" },
  evolutionContainer: { alignItems: "flex-start", marginTop: 20, color: "#fff", backgroundColor: '#00172cff', padding: 12, borderRadius: 10, borderColor: "#005aaeff", borderWidth: 3 },
  evolution: { fontSize: 15, marginBottom: 4, marginLeft: 8, color: "#7f7f7fff"},
  evoRow: { flexDirection: "row", alignItems: "center", marginBottom: 6, color: "#fff"},
  evoImage: { width: 40, height: 40, marginRight: 6, borderRadius: 10, backgroundColor: "#eee" },
  typeContainer: { alignItems: "flex-start", marginTop: 20, marginLeft: 30, backgroundColor: '#fff' },
});