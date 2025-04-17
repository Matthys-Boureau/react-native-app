import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import SvgImage from '@/components/svg';

interface Props {
  id: number;
  maxId?: number;
  imgUrl?: string;
}

export default function PokemonNavigationArrows({ id, maxId = 151, imgUrl }: Props) {
  const router = useRouter();

  const goTo = (newId: number) => {
    router.replace(`/${newId}`);
  };

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 12,
      width: '100%',
    }}>
      <TouchableOpacity
        disabled={id <= 1}
        onPress={() => goTo(id - 1)}
        style={{ opacity: id <= 1 ? 0.3 : 1 }}
      >
        <Text style={{ fontSize: 24, color: 'white' }}>←</Text>
      </TouchableOpacity>
      <SvgImage uri={imgUrl || ''} width={200} height={200} />
      <TouchableOpacity
        disabled={id >= maxId}
        onPress={() => goTo(id + 1)}
        style={{ opacity: id >= maxId ? 0.3 : 1 }}
      >
        <Text style={{ fontSize: 24, color: 'white' }}>→</Text>
      </TouchableOpacity>
    </View>
  );
}