import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
}

export function Modal({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
  loading = false,
}: ModalProps) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          className={`absolute inset-0 ${isDark ? "bg-black/75" : "bg-black/45"}`}
          onPress={onClose}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            className={`rounded-t-3xl ${isDark ? "bg-[#0f172a]" : "bg-white"}`}
            style={{
              maxHeight: "92%",
              paddingBottom: Math.max(insets.bottom, Platform.OS === "android" ? 16 : 8),
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 24,
            }}
          >
            <View className="items-center pt-3 pb-1">
              <View className={`w-10 h-1 rounded-full ${isDark ? "bg-white/15" : "bg-black/15"}`} />
            </View>

            <View
              className={`flex-row items-start justify-between px-5 py-3 border-b ${
                isDark ? "border-white/[0.08]" : "border-slate-200"
              }`}
            >
              <View className="flex-1 pr-4">
                <Text className={`text-xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
                  {title}
                </Text>
                {subtitle ? (
                  <Text className={`text-sm mt-0.5 ${isDark ? "text-white/50" : "text-slate-500"}`}>
                    {subtitle}
                  </Text>
                ) : null}
              </View>
              <TouchableOpacity
                onPress={onClose}
                className={`w-9 h-9 rounded-full items-center justify-center ${
                  isDark ? "bg-white/10" : "bg-black/5"
                }`}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={20} color={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"} />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="px-5 pt-4"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {children}
            </ScrollView>

            {footer ? (
              <View
                className={`px-5 pt-3 border-t ${
                  isDark ? "border-white/[0.08]" : "border-slate-200"
                }`}
              >
                {footer}
              </View>
            ) : null}

            {loading ? (
              <View className="absolute inset-0 items-center justify-center rounded-t-3xl bg-black/20">
                <ActivityIndicator size="large" color="#2d6a4f" />
              </View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </View>
    </RNModal>
  );
}
