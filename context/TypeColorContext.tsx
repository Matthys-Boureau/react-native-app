import React, { createContext, useContext, useState } from 'react';

const TypeColorContext = createContext({
    color: '#EF6351',
    setColor: (color: string) => {},
});

export const TypeColorProvider = ({ children }: any) => {
    const [color, setColor] = useState('#EF6351');
    return (
        <TypeColorContext.Provider value={{ color, setColor }}>
            {children}
        </TypeColorContext.Provider>
    );
};

export const useTypeColor = () => useContext(TypeColorContext);