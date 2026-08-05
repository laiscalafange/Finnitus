import { Text, View, StyleSheet } from "react-native";

export default function Index() {
<<<<<<< Updated upstream
  return (
    <View style={styles.container}>
      <Text>Finnitus</Text>
    </View>
  );
=======
  const router = useRouter();

  useEffect(() => {
    //joga o usuário para a tela de login assim que ele abrir o app
    router.replace("/Trilhe");
  }, []);

  return null;
>>>>>>> Stashed changes
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
