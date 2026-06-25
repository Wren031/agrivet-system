import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Package, Calendar, Tag, Box, AlertTriangle, TrendingUp } from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Item } from "../../../types";
import { getImageUrl } from "@/config/api.config";

function PesoIcon({ size = 18, color = "#2d6a4f" }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: size * 0.85, fontWeight: "900", color, lineHeight: size }}>₱</Text>
    </View>
  );
}

function StatBadge({ label, value, color }: { label: string; value: string; color: string }) {
  const { isDark } = useTheme();
  return (
    <View className="flex-1 items-center py-3 px-2">
      <Text className={`text-2xl font-bold mb-1`} style={{ color }}>{value}</Text>
      <Text className={`text-[11px] font-medium text-${isDark ? "white/50" : "black/50"} uppercase tracking-wider text-center`}>
        {label}
      </Text>
    </View>
  );
}

function InfoRow({ icon, label, value, highlight }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean }) {
  const { isDark } = useTheme();
  return (
    <View className="flex-row items-center py-3.5">
      <View className="w-10 h-10 rounded-xl bg-brand/10 items-center justify-center mr-3.5">
        {icon}
      </View>
      <View className="flex-1">
        <Text className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-white/40" : "text-black/40"} mb-0.5`}>
          {label}
        </Text>
        <Text className={`text-base ${highlight ? "font-extrabold text-brand" : "font-semibold"} text-${isDark ? "white" : "black"}`}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  const { isDark } = useTheme();
  return (
    <View className={`rounded-2xl p-5 mb-4 border ${isDark ? "bg-[#1e293b] border-white/10" : "bg-white border-black/5 shadow-sm"}`}
      style={isDark ? {} : { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
    >
      <View className="flex-row items-center gap-3 mb-4">
        <View className="w-1 h-9 rounded-full bg-brand" />
        <Text className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-white/50" : "text-black/40"}`}>
          {title}
        </Text>
      </View>
      <View className="gap-0">
        {children}
      </View>
    </View>
  );
}

export function ItemDetailScreen({ route, navigation }: any) {
  const { isDark } = useTheme();
  const item: Item = route.params.item;
  const [imageError, setImageError] = React.useState(false);

  const imageUri = getImageUrl(item.image);
  const showImage = !!imageUri && !imageError;
  const margin = item.price - item.costPrice;
  const marginPercent = item.costPrice > 0 ? ((margin / item.costPrice) * 100).toFixed(1) : "0.0";

  const stockColor = item.stock <= item.reorderPoint ? "#ef4444" : item.stock <= item.reorderPoint * 2 ? "#f59e0b" : "#2d6a4f";
  const stockLabel = item.stock <= item.reorderPoint ? "Critical" : item.stock <= item.reorderPoint * 2 ? "Low Stock" : "In Stock";

  return (
    <SafeAreaView className={`flex-1 bg-${isDark ? "[#0f172a]" : "[#f0f4f2]"}`}>
      <View className={`flex-row items-center px-4 py-3.5 border-b ${isDark ? "border-white/10 bg-[#0f172a]" : "border-black/5 bg-white/80"}`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center -ml-2 rounded-xl active:bg-black/5"
        >
          <ArrowLeft size={22} color={isDark ? "#94a3b8" : "#475569"} />
        </TouchableOpacity>
        <Text className={`flex-1 text-base font-bold text-${isDark ? "white" : "black"} text-center mr-6 tracking-tight`}>
          Item Details
        </Text>
      </View>

      <ScrollView contentContainerClassName="pb-6" showsVerticalScrollIndicator={false}>
        <View className={`${isDark ? "bg-[#1e293b]" : "bg-white"} mb-4 border-b ${isDark ? "border-white/10" : "border-black/5"}`}
          style={isDark ? {} : { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
        >
          {showImage ? (
            <Image source={{ uri: imageUri }} className="w-full h-60" resizeMode="cover" onError={() => setImageError(true)} />
          ) : (
            <View className="w-full h-48 bg-brand/5 items-center justify-center">
              <View className="w-20 h-20 rounded-2xl bg-brand/10 items-center justify-center">
                <Package size={40} color="rgba(45,106,79,0.3)" />
              </View>
            </View>
          )}

          <View className="px-5 pt-5 pb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="px-3 py-1 rounded-full bg-brand/10 border border-brand/20">
                <Text className="text-[11px] font-bold text-brand tracking-wide">{item.category}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full border ${isDark ? "border-white/10" : "border-black/10"}`}>
                <Text className={`text-[11px] font-semibold text-${isDark ? "white/60" : "black/60"} tracking-wide`}>
                  {item.unit}
                </Text>
              </View>
            </View>

            <Text className={`text-2xl font-extrabold text-${isDark ? "white" : "black"} tracking-tight mb-1.5`}>
              {item.name}
            </Text>

            {item.description ? (
              <Text className={`text-sm leading-6 text-${isDark ? "white/60" : "black/60"} mb-4`}>
                {item.description}
              </Text>
            ) : null}

            <View className={`flex-row items-center justify-between pt-4 border-t ${isDark ? "border-white/10" : "border-black/5"}`}>
              <View>
                <Text className={`text-[11px] font-semibold uppercase tracking-wider text-${isDark ? "white/40" : "black/40"} mb-1`}>
                  Selling Price
                </Text>
                <Text className="text-3xl font-extrabold text-brand tracking-tight">
                  ₱{item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <View className="items-end">
                <Text className={`text-[11px] font-semibold uppercase tracking-wider text-${isDark ? "white/40" : "black/40"} mb-1`}>
                  Stock
                </Text>
                <View className="flex-row items-center gap-2">
                  <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stockColor }} />
                  <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
                    {item.stock}
                  </Text>
                  <Text className={`text-sm text-${isDark ? "white/50" : "black/50"}`}>units</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4">
          <View className={`flex-row rounded-2xl mb-4 overflow-hidden border ${isDark ? "bg-[#1e293b] border-white/10" : "bg-white border-black/5 shadow-sm"}`}
            style={isDark ? {} : { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}
          >
            <StatBadge
              label="Margin"
              value={`${marginPercent}%`}
              color={margin >= 0 ? "#2d6a4f" : "#ef4444"}
            />
            <View className={`w-px self-stretch my-3 ${isDark ? "bg-white/10" : "bg-black/5"}`} />
            <StatBadge
              label="Status"
              value={stockLabel}
              color={stockColor}
            />
          </View>

          <SectionCard title="Pricing & Stock">
            <InfoRow
              icon={<PesoIcon size={18} color="#2d6a4f" />}
              label="Selling Price"
              value={`₱${item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`}
              highlight
            />
            <View className={`h-px ${isDark ? "bg-white/5" : "bg-black/5"} ml-[52px]`} />
            <InfoRow
              icon={<TrendingUp size={18} color={margin >= 0 ? "#2d6a4f" : "#ef4444"} />}
              label="Profit Margin"
              value={`₱${margin.toLocaleString("en-PH", { minimumFractionDigits: 2 })} (${marginPercent}%)`}
            />
            <View className={`h-px ${isDark ? "bg-white/5" : "bg-black/5"} ml-[52px]`} />
            <InfoRow
              icon={<Box size={18} color="#2d6a4f" />}
              label="Current Stock"
              value={`${item.stock} ${item.unit}`}
            />
            <View className={`h-px ${isDark ? "bg-white/5" : "bg-black/5"} ml-[52px]`} />
            <InfoRow
              icon={<AlertTriangle size={18} color="#f59e0b" />}
              label="Reorder Point"
              value={`${item.reorderPoint} ${item.unit}`}
            />
          </SectionCard>

          <SectionCard title="Product Details">
            <InfoRow
              icon={<Tag size={18} color="#2d6a4f" />}
              label="Category"
              value={item.category}
            />
            <View className={`h-px ${isDark ? "bg-white/5" : "bg-black/5"} ml-[52px]`} />
            <InfoRow
              icon={<Package size={18} color="#2d6a4f" />}
              label="Unit of Measurement"
              value={item.unit}
            />
            {item.expiryDate && (
              <>
                <View className={`h-px ${isDark ? "bg-white/5" : "bg-black/5"} ml-[52px]`} />
                <InfoRow
                  icon={<Calendar size={18} color="#2d6a4f" />}
                  label="Expiry Date"
                  value={new Date(item.expiryDate).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                />
              </>
            )}
          </SectionCard>


        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
