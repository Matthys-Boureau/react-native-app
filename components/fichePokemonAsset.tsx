import React from 'react'
import { View, Image } from 'react-native'

export default function PokeballAsset() {
    return (
        <View style={{ position: 'absolute', top: 12, right: 12 }}>
            <Image
                source={require('../assets/images/pokemonFp.png')}
                style={{ width: 208, height: 208 }}
            />
        </View>
    )
}