import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ThemeProviderCustom, useThemeContext } from '@/ThemeContext';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { RealmProvider } from '@realm/react';
import { Setting } from '@/lib/realmSchema';
import { StatusBar } from 'expo-status-bar';
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';

SplashScreen.preventAutoHideAsync();

const translations = {
  en: {
    back: 'back',
    setting: 'Setting',
    pomodoro: 'Pomodoro',
    break: 'Break',
  },
  ja: {
    back: '戻る',
    setting: 'Setting',
    pomodoro: 'ポモドーロ',
    break: '休憩',
  },
};

export default function RootLayout() {
  const i18n = new I18n(translations);
  i18n.locale = getLocales()[0].languageCode ?? 'en';
  i18n.enableFallback = true;

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
              options={{
                headerShown: true,
                title: i18n.t('setting'),
                headerBackTitle: i18n.t('back'),
              }}
            />
            <Stack.Screen
              name="setting/change-timer/[type]"
              options={({ route }: { route: { params?: { type?: string } } }) => ({
                headerShown: true,
                title: route.params?.type === 'pomodoro' ? i18n.t('pomodoro') : i18n.t('break'),
                headerBackTitle: i18n.t('back'),
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
