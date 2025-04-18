import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';

interface Stat {
    base_stat: number;
    stat: {
        name: string;
    };
}

interface StatHexagonProps {
    stats: Stat[];
    color: string;
}

const StatHexagon: React.FC<StatHexagonProps> = ({ stats, color }) => {
    // Mapping pour les noms des stats
    const statNames = {
        'hp': 'HP',
        'attack': 'ATK',
        'defense': 'DEF',
        'special-attack': 'SP.ATK',
        'special-defense': 'SP.DEF',
        'speed': 'SPD'
    };
    
    // Configuration du graphique
    const size = 100; // taille du graphique
    const center = { x: size, y: size };
    const maxValue = 150; // valeur max pour une stat à 100%
    
    // Calculer les points pour l'hexagone de base (100%)
    const hexagonPoints = [];
    const dataPoints = [];

    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2; // Commence par le haut
        const x = center.x + size * 0.8 * Math.cos(angle);
        const y = center.y + size * 0.8 * Math.sin(angle);
        hexagonPoints.push({ x, y });
        
        // Calculer les points pour les données réelles
        const stat = stats[i];
        const value = stat.base_stat;
        const ratio = Math.min(value / maxValue, 1); // limité à 1 (100%)
        
        const dataX = center.x + size * 0.8 * ratio * Math.cos(angle);
        const dataY = center.y + size * 0.8 * ratio * Math.sin(angle);
        dataPoints.push({ x: dataX, y: dataY });
    }
    
    // Convertir les points en chaîne pour le SVG
    const hexagonPath = hexagonPoints.map(p => `${p.x},${p.y}`).join(' ');
    const statsPath = dataPoints.map(p => `${p.x},${p.y}`).join(' ');
    
    return (
        <View style={styles.statsHexagonContainer}>
            <Svg height={size * 2} width={size * 2} viewBox={`0 0 ${size * 2} ${size * 2}`}>
                {/* Hexagones de fond (3 niveaux) */}
                <Polygon
                    points={hexagonPoints.map(p => `${center.x + (p.x - center.x) * 0.33},${center.y + (p.y - center.y) * 0.33}`).join(' ')}
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="1"
                />
                <Polygon
                    points={hexagonPoints.map(p => `${center.x + (p.x - center.x) * 0.66},${center.y + (p.y - center.y) * 0.66}`).join(' ')}
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="1"
                />
                <Polygon
                    points={hexagonPath}
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="1"
                />
                
                {/* Lignes du centre vers les coins */}
                {hexagonPoints.map((point, index) => (
                    <Line
                        key={index}
                        x1={center.x}
                        y1={center.y}
                        x2={point.x}
                        y2={point.y}
                        stroke="#e0e0e0"
                        strokeWidth="1"
                    />
                ))}
                
                {/* Zone de statistiques */}
                <Polygon
                    points={statsPath}
                    fill={color}
                    fillOpacity="0.5"
                    stroke={color}
                    strokeWidth="2"
                />
                
                {/* Points aux sommets de la zone de stats */}
                {dataPoints.map((point, index) => (
                    <Circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill={color}
                    />
                ))}
                
                {/* Étiquettes des stats */}
                {hexagonPoints.map((point, index) => {
                    const statName = statNames[stats[index].stat.name] || stats[index].stat.name.toUpperCase();
                    const labelOffsetMultiplier = 1.15; // Pour placer les labels un peu à l'extérieur
                    const labelX = center.x + (point.x - center.x) * labelOffsetMultiplier;
                    const labelY = center.y + (point.y - center.y) * labelOffsetMultiplier;
                    
                    return (
                        <SvgText
                            key={index}
                            x={labelX}
                            y={labelY}
                            fontSize="12"
                            fontWeight="bold"
                            fill={color}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                        >
                            {statName}
                        </SvgText>
                    );
                })}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    statsHexagonContainer: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 24,
    },
    statsValues: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        marginTop: 20,
        width: '100%',
    },
    statValueRow: {
        width: '30%',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValueLabel: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    statValueNumber: {
        fontSize: 14,
    },
});

export default StatHexagon;