{/* Botões sólidos, sem gradiente */}
<View style={styles.linhaBotoes}>
  <Pressable
    style={({ pressed }) => [
      styles.botaoDepositar,
      pressed && styles.botaoPressionado,
    ]}
    onPress={() => abrirModal("depositar")}
    accessibilityRole="button"
  >
    <Text style={styles.textoBotaoDepositar}>
      Depositar
    </Text>
  </Pressable>

  <Pressable
    style={({ pressed }) => [
      styles.botaoRetirar,
      pressed && styles.botaoPressionado,
    ]}
    onPress={() => abrirModal("retirar")}
    accessibilityRole="button"
  >
    <Text style={styles.textoBotaoRetirar}>
      Retirar
    </Text>
  </Pressable>
</View>