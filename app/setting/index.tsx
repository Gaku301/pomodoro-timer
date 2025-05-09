import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Switch, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useQuery, useRealm } from '@realm/react';
import { Setting } from '@/lib/realmSchema';
import { useThemeContext } from '@/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SettingsScreen() {
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
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
          <View style={{ ...styles.settingItemWithLine, borderBottomColor: colors.border }}>
            <Text style={{ ...styles.settingLabel, color: colors.text }}>ポモドーロタイマー</Text>
            <Text style={{ ...styles.settingLabel, color: colors.text }}>
              {setting?.pomodoroTime}分
            </Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={{ ...styles.settingLabel, color: colors.text }}>休憩</Text>
            <Text style={{ ...styles.settingLabel, color: colors.text }}>
              {setting?.breakTime}分
            </Text>
          </View>
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
