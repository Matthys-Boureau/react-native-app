export const getColorFromType = (type: string) => {
    switch (type) {
        case 'fire': return '#F7786B';
        case 'water': return '#58ABF6';
        case 'grass': return '#49D0B0';
        case 'electric': return '#FFD76F';
        case 'psychic': return '#FF9AA2';
        case 'rock': return '#FF9AA2';
        case 'ghost': return '#8571BE';
        case 'bug': return '#A8B820';
        case 'poison': return '#A040A0';
        case 'ground': return '#E0C068';
        case 'fairy': return '#EE99AC';
        case 'fighting': return '#C03028';
        case 'dark': return '#705848';
        case 'steel': return '#B8B8D0';
        case 'ice': return '#98D8D8';
        case 'flying': return '#A890F0';
        case 'dragon': return '#7038F8';
        default: return '#A8A77A';
    }
};