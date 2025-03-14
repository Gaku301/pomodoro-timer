import { StyleSheet, Image, Platform, SafeAreaView, Text, Button, Dimensions } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function Explore() {
  const circularProgressRef = useRef(null);
  const [count, setCount] = useState(100); // タイマーのカウント
  const [isRunning, setIsRunning] = useState(false); // タイマーが動いているか

  // タイマーを初期化する
  const onReset = () => {
    setIsRunning(false); // タイマーを停止
    setCount(100); // タイマーを初期化
    // アニメーションをリセット
    if (circularProgressRef.current) {
      // @ts-ignore
      circularProgressRef.current.reAnimate(0, 100, 1000);
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
        width={40}
        fill={count}
        rotation={0}
        tintColor="#00e0ff"
        onAnimationComplete={() => console.log('onAnimationComplete')}
        backgroundColor="#3d5875"
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
