import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { Search, ChevronDown, Check } from "lucide-react-native";
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

  const selectedName = useMemo(() => options.find((o) => o.code === value)?.name, [options, value]);

  const filtered = useMemo(() => search.trim()
    ? options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))
    : options, [options, search]);

  const mutedColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)";

  return (
    <View className="mb-4">
      <Text className={`text-sm font-semibold text-${isDark ? "white/80" : "black/75"} mb-1.5`}>
        {label}
      </Text>
      <TouchableOpacity
        className={`w-full px-4 py-3.5 rounded-xl flex-row items-center justify-between border ${
          isDark ? "bg-white/5 border-white/10" : "bg-black/3 border-black/8"
        }`}
        onPress={() => { setSearch(""); setOpen(true); }}
        activeOpacity={0.7}
        disabled={disabled}
        style={{
          shadowColor: "#1b4332",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0 : 0.04,
          shadowRadius: 3,
          elevation: isDark ? 0 : 1,
        }}
      >
        <Text
          className={`text-base ${value ? `text-${isDark ? "white" : "black"}` : `text-${isDark ? "white/35" : "black/35"}`}`}
        >
          {selectedName || placeholder}
        </Text>
        <View className={`w-7 h-7 rounded-lg items-center justify-center ${isDark ? "bg-white/5" : "bg-black/5"}`}>
          <ChevronDown size={16} color={isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"} />
        </View>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          className="flex-1 justify-end"
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            className={`rounded-t-3xl max-h-[80%] ${isDark ? "bg-[#1e293b]" : "bg-white"}`}
          >
            <View className="items-center pt-2 pb-1">
              <View className={`w-10 h-1 rounded-full ${isDark ? "bg-white/20" : "bg-black/15"}`} />
            </View>

            <View className="flex-row items-center mx-5 mt-2 mb-3 px-4 py-2.5 rounded-xl border bg-brand/5 border-brand/20">
              <Search size={17} color="rgba(45,106,79,0.5)" />
              <TextInput
                className={`flex-1 ml-2.5 py-1 text-base ${isDark ? "text-white" : "text-black"}`}
                placeholder="Search..."
                placeholderTextColor={mutedColor}
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")} className="p-1">
                  <View className="w-4 h-4 rounded-full bg-black/20 items-center justify-center">
                    <Text className="text-white text-[10px] font-bold">X</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.code}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
              renderItem={({ item }) => {
                const isSelected = value === item.code;
                return (
                  <TouchableOpacity
                    className={`flex-row items-center px-4 py-3.5 rounded-xl mb-1 ${
                      isSelected
                        ? isDark ? "bg-brand/20" : "bg-brand/10"
                        : isDark ? "active:bg-white/5" : "active:bg-black/5"
                    }`}
                    onPress={() => {
                      onSelect(item.code);
                      setOpen(false);
                    }}
                    activeOpacity={0.6}
                  >
                    <View className="flex-1">
                      <Text
                        className={`text-base ${
                          isSelected
                            ? "text-brand font-bold"
                            : `text-${isDark ? "white" : "black"}`
                        }`}
                      >
                        {item.name}
                      </Text>
                    </View>
                    {isSelected && (
                      <View className="w-6 h-6 rounded-full bg-brand items-center justify-center">
                        <Check size={14} color="white" strokeWidth={3} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View className="items-center py-10">
                  <Text className={`text-sm ${isDark ? "text-white/30" : "text-black/30"}`}>
                    No matching options
                  </Text>
                </View>
              }
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
