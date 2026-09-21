import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const KEY = "finnitus.accessToken.v1";

let webToken: string | null = null;

let queue: Promise<unknown> = Promise.resolve();

function serialized<T>(
  task: () => Promise<T>
): Promise<T> {
  const next = queue.then(task, task);

  queue = next.catch(() => undefined);

  return next;
}

export const tokenStorage = {
  get: () =>
    serialized(async () => {
      if (Platform.OS === "web") {
        return webToken;
      }

      return SecureStore.getItemAsync(KEY);
    }),

  set: (token: string) =>
    serialized(async () => {
      if (Platform.OS === "web") {
        webToken = token;
      } else {
        await SecureStore.setItemAsync(KEY, token);
      }
    }),

  remove: () =>
    serialized(async () => {
      if (Platform.OS === "web") {
        webToken = null;
      } else {
        await SecureStore.deleteItemAsync(KEY);
      }
    }),
};