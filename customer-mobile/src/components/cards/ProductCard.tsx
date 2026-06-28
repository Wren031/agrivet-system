import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Star, ShoppingCart } from 'lucide-react-native';
import { useColorTheme } from '../../hooks/useColorTheme';
import { formatCurrency } from '../../utils/helpers';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onViewDetails: () => void;
  onAddToCart: () => void;
}

export function ProductCard({ product, onViewDetails, onAddToCart }: ProductCardProps) {
  const { colors } = useColorTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 14,
        margin: 6,
        width: '47%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
      }}
    >
      <Image
        source={{ uri: product.imageUrl }}
        style={{ width: '100%', height: 130, backgroundColor: colors.surfaceVariant }}
        resizeMode="cover"
      />
      <View style={{ padding: 10 }}>
        <Text
          style={{ fontSize: 11, color: colors.primary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}
        >
          {product.category}
        </Text>
        <Text
          style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 2 }}
          numberOfLines={2}
        >
          {product.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Star size={12} color={colors.accent} fill={colors.accent} />
          <Text style={{ fontSize: 11, color: colors.textSecondary, marginLeft: 4 }}>
            {product.rating} ({product.reviews})
          </Text>
        </View>
        <Text style={{ fontSize: 16, fontWeight: '800', color: colors.primary, marginTop: 6 }}>
          {formatCurrency(product.price)}/{product.unit}
        </Text>
        <Text style={{ fontSize: 11, color: colors.textTertiary, marginTop: 2 }}>
          Stock: {product.stock} {product.unit}
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 8, gap: 6 }}>
          <TouchableOpacity
            onPress={onViewDetails}
            style={{
              flex: 1,
              paddingVertical: 7,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.primary,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 11, color: colors.primary, fontWeight: '600' }}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAddToCart}
            style={{
              width: 34, height: 34, borderRadius: 8,
              backgroundColor: colors.primary,
              justifyContent: 'center', alignItems: 'center',
            }}
          >
            <ShoppingCart size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
