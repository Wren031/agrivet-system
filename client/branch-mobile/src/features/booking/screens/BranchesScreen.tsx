import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, MapPin, Store } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { branches } from '../../../constants/branches';

export default function BranchesScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceVariant, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text }}>Branches</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {branches.map((branch) => (
          <View
            key={branch.id}
            style={{
              flexDirection: 'row',
              backgroundColor: colors.surface,
              borderRadius: 14,
              padding: 16,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 14,
            }}
          >
            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#05966915', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={24} color="#059669" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{branch.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                <MapPin size={14} color={colors.textTertiary} />
                <Text style={{ fontSize: 13, color: colors.textSecondary }}>{branch.address}, {branch.city}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
