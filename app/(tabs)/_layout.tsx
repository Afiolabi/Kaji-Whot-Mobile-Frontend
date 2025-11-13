import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

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
    <Path
      d="M8 5V3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 5V3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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

const TasksIcon = ({ color, size = 24, filled = false }: { color: string; size?: number; filled?: boolean }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path
      d="M21 7.5V18.5C21 19.88 19.88 21 18.5 21H5.5C4.12 21 3 19.88 3 18.5V7.5C3 6.12 4.12 5 5.5 5H18.5C19.88 5 21 6.12 21 7.5Z"
      stroke={color}
      strokeWidth="2"
      fill={filled ? color : 'none'}
    />
    <Path
      d="M16 2V8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M8 2V8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M3 10H21"
      stroke={filled ? '#fff' : color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const SettingsIcon = ({ color, size = 24 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19.622 10.395l-1.097-1.896a1.5 1.5 0 00-2.045-.55l-.734.423a1.5 1.5 0 01-2.049-.548 1.5 1.5 0 01.548-2.048l.734-.423a1.5 1.5 0 00.55-2.046L14.432 2.38a1.5 1.5 0 00-2.046-.55l-.733.423a1.5 1.5 0 01-2.049-.548 1.5 1.5 0 01.548-2.048l.734-.423a1.5 1.5 0 00.55-2.046L9.339 4.622a1.5 1.5 0 00-2.045.55l-.734.423a1.5 1.5 0 01-2.049.548 1.5 1.5 0 01-.548-2.048l.734-.423a1.5 1.5 0 00.55-2.046L3.15 2.525"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
      {/* <Tabs.Screen
        name="play"
        options={{
          href: null, // Hide from tab bar, accessed via landing page
        }}
      />
      <Tabs.Screen
        name="mode-selection"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          href: null, // Hide from tab bar, accessed via landing page
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null, // Hide from tab bar, accessed via landing page
        }}
      /> */}
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, focused }) => (
            <TasksIcon color={focused ? '#000' : color} size={24} filled={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
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