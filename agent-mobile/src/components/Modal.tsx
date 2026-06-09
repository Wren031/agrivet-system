import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  return (
    <RNModal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white dark:bg-surface-900 rounded-t-3xl max-h-[90vh]">
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-700">
            <Text className="text-lg font-bold text-surface-900 dark:text-surface-100">
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} className="p-2">
              <Text className="text-surface-500 text-xl">✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView className="px-6 py-4">{children}</ScrollView>
        </View>
      </View>
    </RNModal>
  );
}
