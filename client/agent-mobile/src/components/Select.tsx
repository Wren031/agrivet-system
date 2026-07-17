import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
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
  loading?: boolean;
  error?: string;
}

export function Select({
  label,
  options,
  value,
  onSelect,
  placeholder = "Select",
  disabled = false,
  loading = false,
  error,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { isDark } = useTheme();

  const selectedName = useMemo(
    () => options.find((o) => o.code === value)?.name,
    [options, value]
  );

  const filtered = useMemo(
    () =>
      search.trim()
        ? options.filter((o) =>
            o.name.toLowerCase().includes(search.toLowerCase())
          )
        : options,
    [options, search]
  );

  return (
    <View className="mb-4">
      <Text
        className={`text-sm font-semibold mb-1.5 ${
          isDark ? "text-white/80" : "text-slate-700"
        }`}
      >
        {label}
      </Text>
      <TouchableOpacity
        className={`w-full px-4 rounded-xl flex-row items-center justify-between border ${
          isDark
            ? "bg-white/5 border-white/10"
            : "bg-white border-slate-200"
        } ${disabled ? "opacity-45" : ""}`}
        style={{
          height: 52,
          shadowColor: "#1b4332",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0 : 0.04,
          shadowRadius: 3,
          elevation: isDark ? 0 : 1,
        }}
        onPress={() => {
          if (!disabled && !loading) {
            setSearch("");
            setOpen(true);
          }
        }}
        activeOpacity={disabled || loading ? 1 : 0.7}
      >
        {loading ? (
          <View className="flex-row items-center gap-2 flex-1 px-0.5">
            <ActivityIndicator
              size="small"
              color={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.35)"}
            />
            <Text
              className={`text-base ${
                isDark ? "text-white/40" : "text-black/35"
              }`}
            >
              Loading...
            </Text>
          </View>
        ) : (
          <>
            <Text
              className={`text-base flex-1 ${
                value
                  ? isDark
                    ? "text-white"
                    : "text-slate-900"
                  : isDark
                    ? "text-white/35"
                    : "text-black/35"
              }`}
              numberOfLines={1}
            >
              {selectedName || placeholder}
            </Text>
            <View
              className={`w-8 h-8 rounded-lg items-center justify-center ${
                isDark ? "bg-white/5" : "bg-black/5"
              } ml-2`}
            >
              <ChevronDown
                size={16}
                color={
                  isDark
                    ? "rgba(255,255,255,0.35)"
                    : "rgba(0,0,0,0.35)"
                }
              />
            </View>
          </>
        )}
      </TouchableOpacity>
      {error ? (
        <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
      ) : null}

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end"
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            className={`rounded-t-3xl max-h-[75%] ${
              isDark ? "bg-[#0f172a]" : "bg-white"
            }`}
          >
            <View className="items-center pt-3 pb-1">
              <View
                className={`w-10 h-1 rounded-full ${
                  isDark ? "bg-white/15" : "bg-black/15"
                }`}
              />
            </View>

            <View
              className={`flex-row items-center mx-5 mt-2 mb-3 px-4 py-3 rounded-xl border ${
                isDark
                  ? "bg-white/5 border-white/10"
                  : "bg-brand/5 border-brand/20"
              }`}
            >
              <Search
                size={17}
                color={
                  isDark
                    ? "rgba(255,255,255,0.4)"
                    : "rgba(45,106,79,0.5)"
                }
              />
              <TextInput
                className={`flex-1 ml-2.5 text-base ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
                placeholder="Search..."
                placeholderTextColor={
                  isDark
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(0,0,0,0.3)"
                }
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
              {search.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearch("")}
                  className="p-1"
                >
                  <View
                    className={`w-5 h-5 rounded-full items-center justify-center ${
                      isDark ? "bg-white/10" : "bg-black/10"
                    }`}
                  >
                    <Text className="text-[10px] font-bold text-black/50 dark:text-white/50">
                      ✕
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={filtered}
              keyExtractor={(item) => item.code}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 24,
              }}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                <View className="items-center py-12">
                  <Text
                    className={`text-sm ${
                      isDark ? "text-white/30" : "text-black/30"
                    }`}
                  >
                    No matching options
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const isSelected = value === item.code;
                return (
                  <TouchableOpacity
                    className={`flex-row items-center px-4 py-3.5 rounded-xl mb-0.5 ${
                      isSelected
                        ? isDark
                          ? "bg-brand/20"
                          : "bg-brand/10"
                        : isDark
                          ? "active:bg-white/5"
                          : "active:bg-black/5"
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
                            : isDark
                              ? "text-white"
                              : "text-slate-900"
                        }`}
                      >
                        {item.name}
                      </Text>
                    </View>
                    {isSelected && (
                      <View className="w-6 h-6 rounded-full bg-brand items-center justify-center">
                        <Check
                          size={14}
                          color="white"
                          strokeWidth={3}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
