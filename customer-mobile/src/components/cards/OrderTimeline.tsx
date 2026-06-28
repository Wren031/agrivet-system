import { View, Text } from 'react-native';
import { Check } from 'lucide-react-native';
import { useColorTheme } from '../../hooks/useColorTheme';
import { TimelineEntry } from '../../types';

interface OrderTimelineProps {
  timeline: TimelineEntry[];
}

export function OrderTimeline({ timeline }: OrderTimelineProps) {
  const { colors } = useColorTheme();

  return (
    <View style={{ paddingVertical: 8 }}>
      {timeline.map((entry, index) => (
        <View key={entry.status} style={{ flexDirection: 'row', marginBottom: 4 }}>
          <View style={{ alignItems: 'center', width: 32 }}>
            <View
              style={{
                width: 24, height: 24, borderRadius: 12,
                backgroundColor: entry.completed ? colors.primary : colors.surfaceVariant,
                justifyContent: 'center', alignItems: 'center',
              }}
            >
              {entry.completed && <Check size={14} color="#fff" />}
            </View>
            {index < timeline.length - 1 && (
              <View
                style={{
                  width: 2, flex: 1,
                  backgroundColor: entry.completed ? colors.primary : colors.border,
                  marginVertical: 2,
                }}
              />
            )}
          </View>
          <View style={{ marginLeft: 12, flex: 1, paddingBottom: index < timeline.length - 1 ? 16 : 0 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: entry.completed ? colors.text : colors.textTertiary }}>
              {entry.label}
            </Text>
            {entry.date && (
              <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                {new Date(entry.date).toLocaleDateString('en-PH', {
                  year: 'numeric', month: 'short', day: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
