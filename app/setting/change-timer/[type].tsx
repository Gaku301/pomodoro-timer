import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useThemeContext } from '@/ThemeContext';
import { useQuery, useRealm } from '@realm/react';
import { Setting } from '@/lib/realmSchema';
import { useLocalSearchParams } from 'expo-router';

const ChangeTimer = () => {
  const realm = useRealm();
  const setting = useQuery(Setting)[0];
  const { colors } = useTheme();
  const { isDark } = useThemeContext();
  // ポモドーロ|休憩の選択肢を取得
  const { type } = useLocalSearchParams<{ type: string }>();

  // 初期選択値は5分です
  const [selectedMinute, setSelectedMinute] = useState(
    type === 'pomodoro' ? setting.pomodoroTime : setting.breakTime,
  );
  // 5分ごとの選択肢（5分〜60分）
  const minutes = Array.from({ length: 12 }, (_, i) => (i + 1) * 5);

  const handleMinuteChange = (value: number) => {
    setSelectedMinute(value);
    // 設定を更新
    realm.write(() => {
      if (type === 'pomodoro') {
        setting.pomodoroTime = value;
      } else if (type === 'break') {
        setting.breakTime = value;
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={{ ...styles.title, color: colors.text }}>
        {type === 'pomodoro' ? 'ポモドーロ' : '休憩'}の時間を選択してください
      </Text>
      <View style={{ ...styles.card, backgroundColor: colors.card }}>
        <Picker
          selectedValue={selectedMinute}
          onValueChange={value => handleMinuteChange(Number(value))}
          style={styles.picker}
          // @ts-ignore
          themeVariant={isDark ? 'dark' : 'light'}
        >
          {minutes.map(minute => (
            <Picker.Item key={minute} label={`${minute}分`} value={minute} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  picker: {
    width: '100%',
    height: 60,
  },
  card: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    height: 280,
  },
  title: {
    fontSize: 16,
    paddingVertical: 10,
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

export default ChangeTimer;
