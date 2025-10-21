import { useEffect, useState } from "react";
import { View, Text, Button, Alert, FlatList, TouchableOpacity, TextInput } from "react-native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { addEntry, loadEntries, removeEntry, type Entry } from "../../src/storage/localEntries";
import { uploadAudio, submitText } from "../../src/services/api";

type Mode = "voice" | "text";
const DIR = `${(FileSystem as unknown as { documentDirectory: string }).documentDirectory}dreams/`;

export default function CaptureScreen() {
  const [mode, setMode] = useState<Mode>("voice");

  // ----- state común / lista -----
  const [items, setItems] = useState<Entry[]>([]);
  useEffect(() => {
    (async () => {
      await FileSystem.makeDirectoryAsync(DIR, { intermediates: true }).catch(() => {});
      const all = await loadEntries();
      setItems(all);
    })();
  }, []);

  const reload = async () => setItems(await loadEntries());

  // ----- VOZ -----
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [statusText, setStatusText] = useState("Listo para grabar");
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Activa el micrófono para grabar tus sueños.");
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
      });
    })();
  }, []);

  const startRecording = async () => {
    try {
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
      setStatusText("Grabando…");
    } catch {
      setStatusText("Error al iniciar grabación");
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      const status = await recording.getStatusAsync();
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setStatusText("Guardado");
      if (!uri) return;

      const id = String(Date.now());
      const dest = `${DIR}${id}.m4a`;
      await FileSystem.moveAsync({ from: uri, to: dest });

      const entry: Entry = {
        id,
        type: "audio",
        createdAt: Date.now(),
        uri: dest,
      };
      const duration = (status as { durationMillis?: number })?.durationMillis;
      if (duration !== undefined) {
        entry.durationMs = duration;
      }
      await addEntry(entry);
      await reload();

      // Enviar al backend
      try {
        const { job_id } = await uploadAudio(dest);
        Alert.alert("Enviado al servidor", `Tu audio está en cola. Job ID: ${job_id}`);
      } catch (error) {
        console.warn("Error enviando al backend:", error);
        Alert.alert("Error", "No se pudo enviar al servidor, pero se guardó localmente.");
      }
    } catch {
      setStatusText("Error al guardar");
    }
  };

  const play = async (item: Entry) => {
    if (item.type !== "audio" || !item.uri) return;
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      const { sound: s } = await Audio.Sound.createAsync({ uri: item.uri });
      setSound(s);
      setPlayingId(item.id);
      await s.playAsync();
      s.setOnPlaybackStatusUpdate(async (st) => {
        if ((st as { didJustFinish?: boolean }).didJustFinish) {
          await s.unloadAsync();
          setSound(null);
          setPlayingId(null);
        }
      });
    } catch (e) {
      console.warn("Error playing audio:", e);
    }
  };

  // ----- TEXTO -----
  const [text, setText] = useState("");
  const maxChars = 4000;
  const saveText = async () => {
    const t = text.trim();
    if (t.length < 5) return Alert.alert("Muy corto", "Escribe un poco más para recordar tu sueño.");
    const id = String(Date.now());
    await addEntry({ id, type: "text", createdAt: Date.now(), text: t });
    setText("");
    await reload();
    Alert.alert("Guardado", "Sueño escrito añadido a tu lista.");

    // Enviar al backend
    try {
      const { job_id } = await submitText(t, new Date().toISOString());
      Alert.alert("Enviado al servidor", `Tu texto está en cola. Job ID: ${job_id}`);
    } catch (error) {
      console.warn("Error enviando al backend:", error);
      Alert.alert("Error", "No se pudo enviar al servidor, pero se guardó localmente.");
    }
  };

  // ----- borrar -----
  const del = async (item: Entry) => {
    try {
      if (item.type === "audio" && item.uri) {
        await FileSystem.deleteAsync(item.uri, { idempotent: true }).catch(() => {});
      }
      await removeEntry(item.id);
      if (playingId === item.id && sound) {
        await sound.unloadAsync();
        setSound(null);
        setPlayingId(null);
      }
      await reload();
    } catch (e) {
      console.warn("Error deleting entry:", e);
    }
  };

  // ----- UI -----
  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B10", padding: 16, gap: 16 }}>
      {/* Segmented control */}
      <View style={{ flexDirection: "row", backgroundColor: "#181820", borderRadius: 12 }}>
        {(["voice", "text"] as Mode[]).map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setMode(m)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              backgroundColor: mode === m ? "#6A4CFF" : "transparent",
              alignItems: "center",
            }}
          >
            <Text style={{ color: mode === m ? "#fff" : "#9aa" }}>{m === "voice" ? "Voz" : "Texto"}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {mode === "voice" ? (
        <View style={{ gap: 12 }}>
          <Text style={{ color: "#ddd" }}>{statusText}</Text>
          {!recording ? (
            <Button title="Grabar" onPress={startRecording} />
          ) : (
            <Button title="Detener" onPress={stopRecording} />
          )}
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          <TextInput
            value={text}
            onChangeText={(t) => t.length <= maxChars && setText(t)}
            placeholder="Escribe tu sueño aquí…"
            placeholderTextColor="#666"
            multiline
            style={{
              minHeight: 180,
              color: "#fff",
              backgroundColor: "#181820",
              borderRadius: 12,
              padding: 12,
              textAlignVertical: "top",
            }}
          />
          <Text style={{ color: "#9aa", textAlign: "right" }}>{text.length}/{maxChars}</Text>
          <Button title="Guardar texto" onPress={saveText} />
        </View>
      )}

      {/* Listado unificado */}
      <Text style={{ color: "#9aa", marginTop: 4 }}>Tus entradas</Text>
      <FlatList
        data={items}
        keyExtractor={(x) => x.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#181820",
              padding: 12,
              borderRadius: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={{ color: "#EDEAF5" }}>
                {new Date(item.createdAt).toLocaleString()} · {item.type === "audio" ? "Audio" : "Texto"}
              </Text>
              <Text style={{ color: "#9aa", fontSize: 12 }} numberOfLines={2}>
                {item.type === "audio" ? item.uri?.split("/").pop() : item.text}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {item.type === "audio" ? (
                <TouchableOpacity
                  onPress={() => play(item)}
                  style={{ backgroundColor: "#6A4CFF", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
                >
                  <Text style={{ color: "#fff" }}>{playingId === item.id ? "Reproduciendo…" : "▶"}</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                onPress={() => del(item)}
                style={{ backgroundColor: "#FF4C6A", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }}
              >
                <Text style={{ color: "#fff" }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: "#666" }}>Aún no hay entradas.</Text>}
      />
    </View>
  );
}
