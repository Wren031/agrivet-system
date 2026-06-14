import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { X } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  const { isDark } = useTheme();
  return (
    <RNModal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/40 justify-end">
        <View className={`bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"} rounded-t-3xl max-h-[90vh]`}>
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-brand/20">
            <Text className={`text-lg font-bold text-${isDark ? "white" : "black"}`}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={20} color="#2d6a4f" />
            </TouchableOpacity>
          </View>
          <ScrollView className="px-6 py-4">{children}</ScrollView>
        </View>
      </View>
    </RNModal>
  );
}
