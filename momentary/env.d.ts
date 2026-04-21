/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_BASE: string;
    EXPO_PUBLIC_SPOTIFY_BASE: string;
    EXPO_PUBLIC_PC_IP: string;
  }
}
