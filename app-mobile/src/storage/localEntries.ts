import AsyncStorage from "@react-native-async-storage/async-storage";

export type EntryType = "audio" | "text";
export type Entry = {
  id: string;
  type: EntryType;
  createdAt: number;
  // audio
  uri?: string;          // file path for audio
  durationMs?: number;
  // text
  text?: string;
};

const KEY = "somnia:entries";

export async function loadEntries(): Promise<Entry[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Entry[];
    // sanity: sort desc by createdAt
    return parsed.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export async function saveEntries(all: Entry[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(all));
}

export async function addEntry(e: Entry): Promise<void> {
  const current = await loadEntries();
  current.unshift(e);
  await saveEntries(current);
}

export async function removeEntry(id: string): Promise<void> {
  const current = await loadEntries();
  const next = current.filter((x) => x.id !== id);
  await saveEntries(next);
}
