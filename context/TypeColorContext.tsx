import React, { createContext, useContext, useState } from 'react';

const TypeColorContext = createContext({
    color: '#F26157',
    setColor: (color: string) => {},
});

export const TypeColorProvider = ({ children }: any) => {
    const [color, setColor] = useState('#F26157');
    return (
        <TypeColorContext.Provider value={{ color, setColor }}>
            {children}
        </TypeColorContext.Provider>
    );
};

export const useTypeColor = () => useContext(TypeColorContext);