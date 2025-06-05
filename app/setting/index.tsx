import React from 'react';
import { StyleSheet, View, Text, Switch, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useQuery, useRealm } from '@realm/react';
import { Setting } from '@/lib/realmSchema';
import { useThemeContext } from '@/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Banner from '@/components/Banner';
import { BannerAdSize } from 'react-native-google-mobile-ads';
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  en: {
    setting: 'Setting',
    theme: 'Theme',
    pomodoro: 'Pomodoro',
    m: 'm',
    break: 'Break',
  },
  ja: {
    setting: '設定',
    theme: 'テーマ',
    pomodoro: 'ポモドーロ',
    m: '分',
    break: '休憩',
  },
};

export default function SettingsScreen() {
  const i18n = new I18n(translations);
  i18n.locale = getLocales()[0].languageCode ?? 'en';
  i18n.enableFallback = true;

  const router = useRouter();
  const realm = useRealm();
  const setting = useQuery(Setting)[0];
  const { colors } = useTheme();
  const { isDark, toggleTheme } = useThemeContext();

  const toggleDarkMode = () => {
    toggleTheme();
    realm.write(() => {
      setting.theme = isDark ? 'light' : 'dark';
    });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={{ ...styles.title, color: colors.text }}>{i18n.t('setting')}</Text>
        <View style={{ ...styles.card, backgroundColor: colors.card }}>
          <View style={{ ...styles.settingItemWithLine, borderBottomColor: colors.border }}>
            <Text style={{ ...styles.settingLabel, color: colors.text }}>{i18n.t('theme')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...styles.settingLabel, paddingHorizontal: 10 }}>
                {isDark ? (
                  <Ionicons name="moon" size={20} color={'#B771E5'} />
                ) : (
                  <Ionicons name="sunny" size={20} color={'#FF9D23'} />
                )}
              </Text>

              <Switch value={isDark} onValueChange={toggleDarkMode} />
            </View>
          </View>
          <TouchableOpacity
            style={{ ...styles.settingItemWithLine, borderBottomColor: colors.border }}
            onPress={() => router.push('/setting/change-timer/pomodoro')}
          >
            <Text style={{ ...styles.settingLabel, color: colors.text }}>{i18n.t('pomodoro')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...styles.settingLabel, color: colors.text }}>
                {setting?.pomodoroTime} {i18n.t('m')}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.text}
                style={{ paddingLeft: 10 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/setting/change-timer/break')}
          >
            <Text style={{ ...styles.settingLabel, color: colors.text }}>{i18n.t('break')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...styles.settingLabel, color: colors.text }}>
                {setting?.breakTime} {i18n.t('m')}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={14}
                color={colors.text}
                style={{ paddingLeft: 10 }}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <Banner size={BannerAdSize.LARGE_BANNER} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  card: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
  },
  settingItemWithLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  settingLabel: {
    fontSize: 16,
  },
});
