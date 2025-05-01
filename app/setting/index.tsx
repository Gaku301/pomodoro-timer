import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch, SafeAreaView } from 'react-native';
import { useTheme } from '@react-navigation/native';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(previous => !previous);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={{ ...styles.title, color: colors.text }}>設定</Text>
        <View style={{ ...styles.card, backgroundColor: colors.card }}>
          <View style={styles.settingItem}>
            <Text style={{ ...styles.settingLabel, color: colors.text }}>テーマ</Text>
            <Switch value={darkMode} onValueChange={toggleDarkMode} />
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
  },
});
