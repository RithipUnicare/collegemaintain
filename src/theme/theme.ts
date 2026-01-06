import { MD3LightTheme, configureFonts } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1E40AF', // Deep Blue
    secondary: '#3B82F6', // Lighter Blue
    tertiary: '#10B981', // Emerald for success/completed
    error: '#EF4444',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    outline: '#E2E8F0',
  },
  roundness: 12,
};

export default theme;
