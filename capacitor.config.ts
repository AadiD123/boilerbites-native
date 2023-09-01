import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.aadi.boilerbites",
  appName: "boilerbites-native",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
