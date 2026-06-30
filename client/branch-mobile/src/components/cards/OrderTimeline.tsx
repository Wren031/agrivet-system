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
    <View className="py-2 px-1">
      {timeline.map((entry, index) => {
        const isLast = index === timeline.length - 1;
        return (
          <View key={entry.status} className="flex-row">
            <View className="items-center w-8">
              <View
                className="w-7 h-7 rounded-full items-center justify-center"
                style={{
                  backgroundColor: entry.completed ? '#059669' : colors.surfaceVariant,
                  borderWidth: entry.completed ? 0 : 2,
                  borderColor: colors.border,
                }}
              >
                {entry.completed && <Check size={16} color="#fff" />}
              </View>
              {!isLast && (
                <View
                  className="w-0.5 flex-1 my-1"
                  style={{ backgroundColor: entry.completed ? '#059669' : colors.border }}
                />
              )}
            </View>
            <View className={`ml-3.5 flex-1 ${isLast ? '' : 'pb-5'}`}>
              <Text
                className="text-base font-semibold"
                style={{ color: entry.completed ? colors.text : colors.textTertiary }}
              >
                {entry.label}
              </Text>
              {entry.date && (
                <Text className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
                  {new Date(entry.date).toLocaleDateString('en-PH', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </Text>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}
