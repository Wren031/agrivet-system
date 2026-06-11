import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { Search, ChevronDown } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";

interface Option {
  code: string;
  name: string;
}

interface SelectProps {
  label: string;
  options: Option[];
  value: string;
  onSelect: (code: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Select({
  label,
  options,
  value,
  onSelect,
  placeholder = "Select...",
  disabled = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { isDark } = useTheme();

  const selectedName = options.find((o) => o.code === value)?.name;

  const filtered = search.trim()
    ? options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <View className="mb-4">
      <Text className={`text-sm font-medium text-${isDark ? "white/80" : "black/80"} mb-1.5`}>
        {label}
      </Text>
      <TouchableOpacity
        className="w-full px-4 py-3 rounded-xl flex-row items-center justify-between bg-brand/5 border border-brand/20"
        onPress={() => { setSearch(""); setOpen(true); }}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text className={value ? `text-base text-${isDark ? "white" : "black"}` : `text-base text-${isDark ? "white/40" : "black/40"}`}>
          {selectedName || placeholder}
        </Text>
        <ChevronDown size={18} color="rgba(24,119,242,0.4)" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/40 justify-center px-6"
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            className={`bg-${isDark ? "[#1A1A1A]" : "white"} rounded-2xl max-h-[70%]`}
          >
            <View className="flex-row items-center px-4 py-3 border-b border-brand/20">
              <Search size={18} color="rgba(24,119,242,0.4)" />
              <TextInput
                className={`flex-1 ml-2 py-1 text-base text-${isDark ? "white" : "black"}`}
                placeholder="Search..."
                placeholderTextColor="rgba(24,119,242,0.4)"
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
            </View>
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`px-4 py-3.5 border-b border-brand/10 ${
                    value === item.code ? "bg-brand/10" : ""
                  }`}
                  onPress={() => { onSelect(item.code); setOpen(false); }}
                >
                  <Text
                    className={`text-base ${
                      value === item.code
                        ? `text-${isDark ? "white" : "black"} font-bold`
                        : `text-${isDark ? "white/70" : "black/70"}`
                    }`}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="items-center py-8">
                  <Text className={`text-${isDark ? "white/40" : "black/40"}`}>No options found</Text>
                </View>
              }
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
