import { Stack } from 'expo-router';
import "../global.css";
import { useFonts } from 'expo-font'; 
import * as SplashScreen from 'expo-splash-screen'; 
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'SFPro-Regular': require('../assets/fonts/SFPro-Regular.ttf')
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="addModal" options={{ presentation: 'modal'}} />
    </Stack>
  )
}
