// ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Theme } from '@react-navigation/native';
import { DarkTheme, LightTheme } from './config/theme';
import { useQuery, useRealm } from '@realm/react';
import { Setting } from './lib/realmSchema';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderCustom = ({ children }: { children: ReactNode }) => {
  // 設定データを取得
  const realm = useRealm();
  const settings = useQuery(Setting);
  // 設定データがない場合は新規作成
  const setting: Setting = settings.isEmpty()
    ? realm.write(() => realm.create('Setting', Setting.generate()) as unknown as Setting)
    : settings[0];

  const [isDark, setIsDark] = useState(setting.theme === 'dark');

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext must be used within ThemeProviderCustom');
  return context;
};
