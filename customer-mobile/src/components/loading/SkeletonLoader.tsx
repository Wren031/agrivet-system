import { View, StyleSheet } from 'react-native';
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
    <View style={{ padding: 16 }}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <SkeletonLoader width={80} height={80} borderRadius={8} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <SkeletonLoader width="60%" height={16} />
              <SkeletonLoader width="40%" height={12} style={{ marginTop: 8 }} />
              <SkeletonLoader width="30%" height={12} style={{ marginTop: 8 }} />
              <SkeletonLoader width={60} height={22} borderRadius={11} style={{ marginTop: 8 }} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

export function StatSkeleton() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 16, gap: 12 }}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ width: '47%' }}>
          <SkeletonLoader height={100} borderRadius={12} />
        </View>
      ))}
    </View>
  );
}

export function ProductGridSkeleton() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 8, gap: 0 }}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ width: '50%', padding: 8 }}>
          <SkeletonLoader height={240} borderRadius={12} />
        </View>
      ))}
    </View>
  );
}
