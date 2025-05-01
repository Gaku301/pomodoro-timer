import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, Dimensions, View, TouchableOpacity } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { DarkTheme, useTheme } from '@react-navigation/native';

export default function TimerScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('pomodoro'); // "pomodoro" または "break"

  const POMODORO_SECONDS = 25 * 60; // 25分
  const BREAK_SECONDS = 1 * 60; // 5分

  const [pomodoroSeconds, setPomodoroSeconds] = useState(POMODORO_SECONDS);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);

  const [breakSeconds, setBreakSeconds] = useState(BREAK_SECONDS);
  const [breakRunning, setBreakRunning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTab === 'pomodoro' && pomodoroRunning) {
      timer = setInterval(() => {
        setPomodoroSeconds(prev => {
          if (prev > 0) {
            const newVal = prev - 1;
            if (newVal === 0) {
              console.log('ポモドーロタイマーが0秒になりました');
              setTimeout(() => {
                setActiveTab('break');
                stopPomodoro();
              }, 700);
            }
            return newVal;
          }
          return 0;
        });
      }, 1000);
    } else if (activeTab === 'break' && breakRunning) {
      timer = setInterval(() => {
        setBreakSeconds(prev => {
          if (prev > 0) {
            const newVal = prev - 1;
            if (newVal === 0) {
              console.log('休憩タイマーが0分0秒になりました');
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
              ポモドーロ
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
              休憩
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
    marginVertical: 30,
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
