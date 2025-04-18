export const getColorFromType = (type: string) => {
    switch (type) {
        case 'fire': return '#FF7F11';
        case 'water': return '#5AA9E6';
        case 'grass': return '#ACEB98';
        case 'electric': return '#FFD76F';
        case 'psychic': return '#FF9AA2';
        case 'rock': return '#C0B298';
        case 'ghost': return '#8D86C9';
        case 'bug': return '#A8B820';
        case 'poison': return '#A040A0';
        case 'ground': return '#E0C068';
        case 'fairy': return '#EE99AC';
        case 'fighting': return '#C03028';
        case 'dark': return '#080708';
        case 'steel': return '#BFB5AF';
        case 'ice': return '#BAD7F2';
        case 'flying': return '#BCEDF6';
        case 'dragon': return '#6B7FD7';
        default: return '#FCDDBC';
    }
};