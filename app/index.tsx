import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
// import { audioSource } from '@/lib/expoAudio';
import Banner from '@/components/Banner';
import { useQuery } from '@realm/react';
import { Setting } from '@/lib/realmSchema';
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import { useKeepAwake } from 'expo-keep-awake';

const translations = {
  en: {
    pomodoro: 'Pomodoro',
    m: 'm',
    break: 'Break',
  },
  ja: {
    pomodoro: 'ポモドーロ',
    m: '分',
    break: '休憩',
  },
};

export default function TimerScreen() {
  const i18n = new I18n(translations);
  i18n.locale = getLocales()[0].languageCode ?? 'en';
  i18n.enableFallback = true;

  const router = useRouter();
  // const player = useAudioPlayer(audioSource);
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('pomodoro'); // "pomodoro" または "break"
  const setting = useQuery(Setting)[0];

  const POMODORO_SECONDS = setting.pomodoroTime * 60; // 25分
  const BREAK_SECONDS = setting.breakTime * 60; // 5分

  const [pomodoroSeconds, setPomodoroSeconds] = useState(POMODORO_SECONDS);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);

  const [breakSeconds, setBreakSeconds] = useState(BREAK_SECONDS);
  const [breakRunning, setBreakRunning] = useState(false);

  useEffect(() => {
    // 設定が変更された場合、ポモドーロと休憩の秒数を更新
    setPomodoroSeconds(setting.pomodoroTime * 60);
    setBreakSeconds(setting.breakTime * 60);
  }, [setting]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTab === 'pomodoro' && pomodoroRunning) {
      // ポモドーロタイマーが起動している場合
      timer = setInterval(() => {
        setPomodoroSeconds(prev => {
          if (prev > 0) {
            const newVal = prev - 1;
            if (newVal === 0) {
              Vibration.vibrate();
              setTimeout(() => {
                setActiveTab('break');
                stopPomodoro();
                // 自動で休憩タイマーを起動
                setTimeout(() => {
                  startBreak();
                }, 700);
              }, 700);
            }
            return newVal;
          }
          return 0;
        });
      }, 1000);
    } else if (activeTab === 'break' && breakRunning) {
      // 休憩タイマーが起動している場合
      timer = setInterval(() => {
        setBreakSeconds(prev => {
          if (prev > 0) {
            const newVal = prev - 1;
            if (newVal === 0) {
              Vibration.vibrate();
              // playBreakSound();
              setTimeout(() => {
                setActiveTab('pomodoro');
                stopBreak();
              }, 700);
            }
            return newVal;
          }
          return 0;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTab, pomodoroRunning, breakRunning]);

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startPomodoro = () => {
    setPomodoroRunning(true);
  };

  const stopPomodoro = () => {
    setPomodoroRunning(false);
    setPomodoroSeconds(POMODORO_SECONDS);
  };

  const startBreak = () => {
    setBreakRunning(true);
  };

  const stopBreak = () => {
    setBreakRunning(false);
    setBreakSeconds(BREAK_SECONDS);
  };

  const onPressActiveTab = (setTarget: string) => {
    if (setTarget === 'pomodoro') {
      // 休憩タイマーが起動している場合はポモドーロタイマータブをアクティブにしない
      if (breakRunning) return;
      setActiveTab('pomodoro');
    } else if (setTarget === 'break') {
      // ポモドーロタイマーが起動している場合は休憩タイマータブをアクティブにしない
      if (pomodoroRunning) return;
      setActiveTab('break');
    }
  };

  const pomodoroFill = (pomodoroSeconds / POMODORO_SECONDS) * 100;
  const breakFill = (breakSeconds / BREAK_SECONDS) * 100;

  const pomodoroColor = '#2E94B9';
  const breakColor = '#FF8400';

  useKeepAwake(); // スクリーンを常にオンにする

  return (
    <SafeAreaView>
      <TouchableOpacity style={styles.settingsIcon} onPress={() => router.navigate('/setting')}>
        <Ionicons name="settings-outline" size={26} style={{ color: colors.text }} />
      </TouchableOpacity>
      <View style={styles.center}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={{
              ...styles.tabButton,
              backgroundColor: activeTab === 'pomodoro' ? pomodoroColor : 'none',
            }}
            onPress={() => onPressActiveTab('pomodoro')}
          >
            <Text
              style={{
                ...styles.tabTitle,
                color: activeTab === 'pomodoro' ? '#fff' : '#9AA6B2',
              }}
            >
              {i18n.t('pomodoro')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...styles.tabButton,
              backgroundColor: activeTab === 'break' ? breakColor : 'none',
            }}
            onPress={() => onPressActiveTab('break')}
          >
            <Text
              style={{
                ...styles.tabTitle,
                color: activeTab === 'break' ? '#fff' : '#9AA6B2',
              }}
            >
              {i18n.t('break')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {activeTab === 'pomodoro' ? (
        <View style={styles.timerContainer}>
          <AnimatedCircularProgress
            size={Dimensions.get('window').width * 0.8}
            width={30}
            fill={pomodoroFill}
            tintColor={pomodoroColor}
            backgroundColor="#DDDDDD"
            rotation={0}
          >
            {() => (
              <Text style={{ ...styles.timerText, color: colors.text }}>
                {formatTime(pomodoroSeconds)}
              </Text>
            )}
          </AnimatedCircularProgress>
          <View style={styles.buttonContainer}>
            {pomodoroRunning ? (
              <TouchableOpacity onPress={stopPomodoro}>
                <Ionicons
                  name="square"
                  size={26}
                  style={{ ...styles.actionButton, color: colors.text }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={startPomodoro}>
                <Ionicons
                  name="play"
                  size={26}
                  style={{ ...styles.actionButton, color: colors.text }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.timerContainer}>
          <AnimatedCircularProgress
            size={Dimensions.get('window').width * 0.8}
            width={30}
            fill={breakFill}
            tintColor={breakColor}
            backgroundColor="#DDDDDD"
            rotation={0}
          >
            {() => (
              <Text style={{ ...styles.timerText, color: colors.text }}>
                {formatTime(breakSeconds)}
              </Text>
            )}
          </AnimatedCircularProgress>
          <View style={styles.buttonContainer}>
            {breakRunning ? (
              <TouchableOpacity onPress={stopBreak}>
                <Ionicons
                  name="square"
                  size={26}
                  style={{ ...styles.actionButton, color: colors.text }}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={startBreak}>
                <Ionicons
                  name="play"
                  size={26}
                  style={{ ...styles.actionButton, color: colors.text }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      <Banner />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
    marginTop: 40,
    marginVertical: 20,
  },
  tabButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  tabTitle: {
    fontSize: 18,
    color: '#9AA6B2',
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 0,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingVertical: 30,
    justifyContent: 'space-around',
    width: '80%',
  },
  actionButton: {
    padding: 10,
  },
  settingsIcon: {
    width: '100%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    paddingRight: 10,
  },
});
