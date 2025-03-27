import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

const themes = {
  light: {
    primary: '#5C3D2E',
    secondary: '#B85C38',
    background: '#FFFFFF',
    modalBg: '#FFFFFF',
    text: '#2D2424',
    textLight: '#4A4A4A',
    inputBg: '#FFFFFF',
    inputText: '#2D2424'
  },
  dark: {
    primary: '#2D2424',
    secondary: '#5C3D2E',
    background: '#1F1F1F',
    modalBg: '#2D2D2D',
    text: '#E0C097',
    textLight: '#D1D1D1',
    inputBg: '#3D3D3D',
    inputText: '#FFFFFF'
  },
  earthy: {
    primary: '#6B4423',
    secondary: '#C68B59',
    background: '#FFF1E6',
    modalBg: '#FFFFFF',
    text: '#40241A',
    textLight: '#5A483F',
    inputBg: '#FFFFFF',
    inputText: '#40241A'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  const toggleTheme = (themeName) => {
    setCurrentTheme(themeName);
    document.documentElement.style.setProperty('--primary-color', themes[themeName].primary);
    document.documentElement.style.setProperty('--secondary-color', themes[themeName].secondary);
    document.documentElement.style.setProperty('--background-color', themes[themeName].background);
    document.documentElement.style.setProperty('--modal-bg', themes[themeName].modalBg);
    document.documentElement.style.setProperty('--text-color', themes[themeName].text);
    document.documentElement.style.setProperty('--text-light', themes[themeName].textLight);
    document.documentElement.style.setProperty('--input-bg', themes[themeName].inputBg);
    document.documentElement.style.setProperty('--input-text', themes[themeName].inputText);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);