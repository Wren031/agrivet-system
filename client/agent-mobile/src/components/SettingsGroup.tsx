import React from "react";
import { View, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

type IconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsGroup({ title, children }: SettingsGroupProps) {
  const { isDark } = useTheme();

  return (
    <View className="px-5 mt-6">
      <Text
        className={`text-xs font-bold uppercase tracking-widest mb-2.5 ${
          isDark ? "text-white/40" : "text-slate-400"
        }`}
      >
        {title}
      </Text>
      <View
        className={`rounded-2xl overflow-hidden border ${
          isDark
            ? "bg-[#1e293b] border-white/[0.08]"
            : "bg-white border-slate-200"
        }`}
        style={{
          shadowColor: "#1b4332",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.15 : 0.05,
          shadowRadius: 8,
          elevation: isDark ? 1 : 2,
        }}
      >
        {children}
      </View>
    </View>
  );
}

interface SettingsRowProps extends TouchableOpacityProps {
  icon: IconComponent;
  label: string;
  subtitle?: string;
  value?: string;
  destructive?: boolean;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
}

export function SettingsRow({
  icon: Icon,
  label,
  subtitle,
  value,
  destructive = false,
  showChevron = true,
  rightElement,
  ...props
}: SettingsRowProps) {
  const { isDark } = useTheme();
  const iconColor = destructive ? "#EF4444" : "#2d6a4f";
  const textColor = destructive
    ? "text-red-500"
    : isDark
      ? "text-white"
      : "text-slate-900";

  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3.5 active:opacity-70"
      activeOpacity={0.7}
      {...props}
    >
      <View
        className={`w-9 h-9 rounded-xl items-center justify-center ${
          destructive
            ? "bg-red-500/10"
            : isDark
              ? "bg-brand/20"
              : "bg-brand/10"
        }`}
      >
        <Icon size={18} color={iconColor} strokeWidth={2} />
      </View>
      <View className="flex-1 ml-3 mr-2">
        <Text className={`text-base font-semibold ${textColor}`}>{label}</Text>
        {subtitle ? (
          <Text
            className={`text-xs mt-0.5 ${isDark ? "text-white/45" : "text-slate-400"}`}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightElement}
      {value ? (
        <Text className={`text-sm mr-1 ${isDark ? "text-white/50" : "text-slate-400"}`}>
          {value}
        </Text>
      ) : null}
      {showChevron && !rightElement ? (
        <ChevronRight
          size={18}
          color={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)"}
        />
      ) : null}
    </TouchableOpacity>
  );
}

export function SettingsDivider() {
  const { isDark } = useTheme();
  return (
    <View
      className={`h-px ml-[60px] ${isDark ? "bg-white/[0.06]" : "bg-slate-100"}`}
    />
  );
}
