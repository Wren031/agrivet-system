import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
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

  const stockLabel = product.stock <= 0 ? 'Out of Stock' : product.stock <= 5 ? 'Low Stock' : 'In Stock';
  const stockColor = product.stock <= 0 ? '#DC2626' : product.stock <= 5 ? '#D97706' : '#16A34A';

  return (
    <TouchableOpacity
      onPress={onViewDetails}
      activeOpacity={0.7}
      style={{
        width: '48%',
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
        marginBottom: 14,
      }}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: product.imageUrl }}
          style={{ width: '100%', height: 150, backgroundColor: colors.surfaceVariant }}
          resizeMode="cover"
        />
        <View style={{
          position: 'absolute', top: 10, left: 10,
          backgroundColor: '#059669',
          paddingHorizontal: 10, paddingVertical: 4,
          borderRadius: 8,
        }}>
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {product.category}
          </Text>
        </View>
      </View>

      <View style={{ padding: 14, gap: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 19 }} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#059669', letterSpacing: -0.5 }}>
            {formatCurrency(product.price)}
          </Text>
          <Text style={{ fontSize: 12, color: colors.textTertiary, marginLeft: 3 }}>
            /{product.unit}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: stockColor }} />
          <Text style={{ fontSize: 11, color: stockColor, fontWeight: '500' }}>{stockLabel}</Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
        <TouchableOpacity
          onPress={onAddToCart}
          activeOpacity={0.8}
          disabled={product.stock <= 0}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            borderRadius: 12,
            backgroundColor: product.stock <= 0 ? colors.surfaceVariant : '#059669',
            gap: 6,
            opacity: product.stock <= 0 ? 0.5 : 1,
          }}
        >
          {product.stock <= 0 ? (
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textTertiary }}>Unavailable</Text>
          ) : (
            <>
              <ShoppingCart size={15} color="#fff" />
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>Add to Cart</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
