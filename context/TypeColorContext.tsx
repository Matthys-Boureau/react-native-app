import React, { createContext, useContext, useState } from 'react';

const TypeColorContext = createContext({
    color: '#DC0A2D',
    setColor: (color: string) => {},
});

export const TypeColorProvider = ({ children }: any) => {
    const [color, setColor] = useState('#DC0A2D');
    return (
        <TypeColorContext.Provider value={{ color, setColor }}>
            {children}
        </TypeColorContext.Provider>
    );
};

export const useTypeColor = () => useContext(TypeColorContext);