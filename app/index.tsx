import { StyleSheet, Image, Platform, SafeAreaView, Text, Button, Dimensions } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Stack } from 'expo-router';

export default function TimerScreen() {
  const InitialCount = 60; // タイマーの初期値(60秒)
  const circularProgressRef = useRef(null);
  const [count, setCount] = useState(InitialCount); // タイマーのカウント
  const [isRunning, setIsRunning] = useState(false); // タイマーが動いているか

  // タイマーを初期化する
  const onReset = () => {
    setIsRunning(false); // タイマーを停止
    setCount(InitialCount); // タイマーを初期化
    // アニメーションをリセット
    if (circularProgressRef.current) {
      // @ts-ignore
      circularProgressRef.current.reAnimate(0, InitialCount, 1000);
    }
  }

  useEffect(() => {
    if (!isRunning) return; // 動作していない場合は何もしない

    const interval = setInterval(() => {
      setCount(prevCount => Math.max(prevCount - 1, 0));
    }, 1000); // 1秒ごとに実行

    return () => clearInterval(interval); // コンポーネントがアンマウントされたときにインターバルをクリア
  }, [isRunning]);

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <AnimatedCircularProgress
        ref={circularProgressRef}
        size={Dimensions.get('screen').width - 60}
        width={40} // 線の太さ
        fill={count} // 進捗率
        rotation={0} // 進捗率の開始位置
        tintColor="#00e0ff" // 進捗率の色
        onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor="#3d5875" // 進捗率以外の色
      >
        {(fill) => (
          <Text style={{fontWeight: 'bold', fontSize: 60}}>{Math.trunc(fill)}%</Text>
        )}
      </AnimatedCircularProgress>

      <Button title="Reset" onPress={onReset} />
      <Button title="Start" onPress={() => {
        setIsRunning(true); // タイマーを開始
      }} />
      <Button title="Stop" onPress={() => {
        setIsRunning(false); // タイマーを停止
      }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
