import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ThemeProviderCustom, useThemeContext } from '@/ThemeContext';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { RealmProvider } from '@realm/react';
import { Setting } from '@/lib/realmSchema';
import { StatusBar } from 'expo-status-bar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <RealmProvider schema={[Setting]}>
      <ThemeProviderCustom>
        <NavigationThemeWrapper>
          <StatusBar style="auto" />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="setting/index"
              options={{ headerShown: true, title: '設定', headerBackTitle: '戻る' }}
            />
            <Stack.Screen
              name="setting/change-timer/[type]"
              options={({ route }: { route: { params?: { type?: string } } }) => ({
                headerShown: true,
                title: route.params?.type === 'pomodoro' ? 'ポモドーロ' : '休憩',
                headerBackTitle: '戻る',
              })}
            />
          </Stack>
        </NavigationThemeWrapper>
      </ThemeProviderCustom>
    </RealmProvider>
  );
}

function NavigationThemeWrapper({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeContext();
  return <NavigationThemeProvider value={theme}>{children}</NavigationThemeProvider>;
}
