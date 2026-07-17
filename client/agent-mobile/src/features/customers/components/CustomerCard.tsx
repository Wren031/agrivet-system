import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Customer } from "../../../types";
import { useTheme } from "../../../context/ThemeContext";

interface CustomerCardProps {
  customer: Customer;
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

function formatAddress(c: Customer): string {
  const parts = [c.address, c.city, c.province].filter(Boolean);
  return parts.join(", ") || "No address";
}

export const CustomerCard = memo(function CustomerCard({
  customer,
  onEdit,
  onDelete,
}: CustomerCardProps) {
  const { isDark } = useTheme();
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View
      className={`rounded-2xl p-4 mb-3 border ${
        isDark
          ? "bg-[#1e293b] border-white/[0.08]"
          : "bg-white border-slate-200"
      }`}
      style={{
        shadowColor: "#1b4332",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.15 : 0.05,
        shadowRadius: 6,
        elevation: isDark ? 1 : 2,
      }}
    >
      <View className="flex-row items-center">
        <View
          className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
            isDark ? "bg-brand/20" : "bg-brand/10"
          }`}
        >
          <Text
            className={`font-bold text-sm ${
              isDark ? "text-white" : "text-brand"
            }`}
          >
            {initials}
          </Text>
        </View>
        <View className="flex-1">
          <Text
            className={`text-base font-bold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
            numberOfLines={1}
          >
            {customer.name}
          </Text>
          {customer.storeName ? (
            <Text
              className={`text-sm ${
                isDark ? "text-white/60" : "text-slate-500"
              }`}
              numberOfLines={1}
            >
              {customer.storeName}
            </Text>
          ) : null}
          <Text
            className={`text-xs mt-0.5 ${
              isDark ? "text-white/40" : "text-slate-400"
            }`}
          >
            {customer.phone}
          </Text>
        </View>
        {onEdit || onDelete ? (
          <View className="flex-row gap-2">
            {onEdit && (
              <TouchableOpacity
                onPress={() => onEdit(customer)}
                className={`w-8 h-8 rounded-lg items-center justify-center ${
                  isDark ? "bg-white/10" : "bg-slate-100"
                }`}
              >
                <Text
                  className={`text-xs ${
                    isDark ? "text-white/70" : "text-slate-600"
                  }`}
                >
                  ✎
                </Text>
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                onPress={() => onDelete(customer)}
                className={`w-8 h-8 rounded-lg items-center justify-center ${
                  isDark ? "bg-red-500/10" : "bg-red-50"
                }`}
              >
                <Text
                  className={`text-xs ${
                    isDark ? "text-red-400" : "text-red-500"
                  }`}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}
      </View>
      <View
        className={`mt-3 pt-3 border-t ${
          isDark ? "border-white/[0.06]" : "border-slate-100"
        }`}
      >
        <Text
          className={`text-xs ${
            isDark ? "text-white/40" : "text-slate-400"
          }`}
          numberOfLines={2}
        >
          {formatAddress(customer)}
        </Text>
      </View>
    </View>
  );
});
