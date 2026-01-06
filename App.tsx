import React from 'react';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigation from './src/navigation/AppNavigation';
import theme from './src/theme/theme';

function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <StatusBar
            backgroundColor={theme.colors.primary}
            barStyle="light-content"
          />
          <AppNavigation />
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
