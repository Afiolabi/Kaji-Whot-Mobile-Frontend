import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Tab icons using SVG
const PlayIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 7.5V18.5C21 19.88 19.88 21 18.5 21H5.5C4.12 21 3 19.88 3 18.5V7.5C3 6.12 4.12 5 5.5 5H18.5C19.88 5 21 6.12 21 7.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 10H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M8 5V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M16 5V3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ScreenIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="4"
      width="18"
      height="13"
      rx="2"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 21H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 17V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TasksIcon = ({
  color,
  size = 24,
  filled = false,
}: {
  color: string;
  size?: number;
  filled?: boolean;
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path
      d="M21 7.5V18.5C21 19.88 19.88 21 18.5 21H5.5C4.12 21 3 19.88 3 18.5V7.5C3 6.12 4.12 5 5.5 5H18.5C19.88 5 21 6.12 21 7.5Z"
      stroke={color}
      strokeWidth="2"
      fill={filled ? color : 'none'}
    />
    <Path d="M16 2V8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M8 2V8" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M3 10H21" stroke={filled ? '#fff' : color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const SettingsIcon = ({ color = '#000', size = 24 }: { color?: string; size?: number }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Outer gear shape */}
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .66.39 1.26 1 1.51a1.65 1.65 0 0 0 1.51-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82z" />

    {/* Inner circle */}
    <Circle cx={12} cy={12} r={3} />
  </Svg>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#B0B0B0',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#EBEBEB',
          height: 80,
          paddingTop: 8,
          paddingBottom: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="landing"
        options={{
          title: 'Play',
          tabBarIcon: ({ color, focused }) => (
            <PlayIcon color={focused ? '#000' : color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="tasks/index"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, focused }) => (
            <TasksIcon color={focused ? '#000' : color} size={24} filled={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <SettingsIcon color={focused ? '#000' : color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
