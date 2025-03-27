import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  const { toggleTheme, currentTheme, themes } = useTheme();

  return (
    <div className="theme-switcher flex items-center space-x-2">
      {Object.keys(themes).map((themeName) => (
        <button
          key={themeName}
          onClick={() => toggleTheme(themeName)}
          className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
            currentTheme === themeName ? 'ring-2 ring-offset-2' : ''
          }`}
          style={{ backgroundColor: themes[themeName].primary }}
          aria-label={`Switch to ${themeName} theme`}
        />
      ))}
    </div>
  );
};

export default ThemeSwitcher;