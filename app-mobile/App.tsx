import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CaptureScreen from './app/(tabs)/capture';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>🎤 Somnia</Text>
      <CaptureScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B10",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 10,
  },
});
