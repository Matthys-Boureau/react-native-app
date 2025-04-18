import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ActivityIndicator, View } from 'react-native';

const PokemonDescription = ({ id }: { id: number }) => {
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDescription = async () => {
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
                const data = await res.json();

                const entry = data.flavor_text_entries.find(
                    (item: any) => item.language.name === 'en'
                );

                const cleanText = entry?.flavor_text
                    ?.replace(/[\n\f\r]/g, ' ')
                    ?.replace(/\s+/g, ' ')
                    ?.trim();

                setDescription(cleanText || 'No description found.');
            } catch (err) {
                console.error('Erreur de fetch de la description:', err);
                setDescription('Error loading description.');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchDescription();
    }, [id]);

    if (loading) {
        return (
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
                <ActivityIndicator size="small" color="#DC0A2D" />
            </View>
        );
    }

    return (
        <Text style={styles.aboutDescription}>
            {description}
        </Text>
    );
};

const styles = StyleSheet.create({
    aboutDescription: {
        fontSize: 16,
        color: '#444',
        textAlign: 'center',
        marginVertical: 16,
        paddingHorizontal: 10,
    },
});

export default PokemonDescription;