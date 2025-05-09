import React from 'react';
import { StyleSheet, View, Text, Switch, SafeAreaView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useQuery, useRealm } from '@realm/react';
import { Setting } from '@/lib/realmSchema';
import { useThemeContext } from '@/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
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
        <Text style={{ ...styles.title, color: colors.text }}>設定</Text>
        <View style={{ ...styles.card, backgroundColor: colors.card }}>
          <View style={{ ...styles.settingItemWithLine, borderBottomColor: colors.border }}>
            <Text style={{ ...styles.settingLabel, color: colors.text }}>テーマ</Text>
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
            <Text style={{ ...styles.settingLabel, color: colors.text }}>ポモドーロ</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...styles.settingLabel, color: colors.text }}>
                {setting?.pomodoroTime}分
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
            <Text style={{ ...styles.settingLabel, color: colors.text }}>休憩</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...styles.settingLabel, color: colors.text }}>
                {setting?.breakTime}分
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
    paddingVertical: 10,
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
