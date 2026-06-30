import { View } from 'react-native';
import { useColorTheme } from '../../hooks/useColorTheme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function SkeletonLoader({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonLoaderProps) {
  const { colors } = useColorTheme();

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.surfaceVariant,
        },
        style,
      ]}
    />
  );
}

export function BookingSkeleton() {
  const { colors } = useColorTheme();
  return (
    <View className="p-4">
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          className="rounded-xl p-4 mb-3"
          style={{
            backgroundColor: colors.surface,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <View className="flex-row">
            <SkeletonLoader width={80} height={80} borderRadius={10} />
            <View className="ml-3.5 flex-1">
              <SkeletonLoader width="60%" height={16} borderRadius={4} />
              <SkeletonLoader width="40%" height={12} style={{ marginTop: 10 }} borderRadius={4} />
              <SkeletonLoader width="30%" height={12} style={{ marginTop: 10 }} borderRadius={4} />
              <SkeletonLoader width={70} height={24} borderRadius={12} style={{ marginTop: 10 }} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

export function StatSkeleton() {
  return (
    <View className="flex-row flex-wrap p-4" style={{ gap: 12 }}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ width: '47%' }}>
          <SkeletonLoader height={110} borderRadius={16} />
        </View>
      ))}
    </View>
  );
}

export function ProductGridSkeleton() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 4 }}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ width: '47%', marginBottom: 12 }}>
          <SkeletonLoader height={260} borderRadius={14} />
        </View>
      ))}
    </View>
  );
}
