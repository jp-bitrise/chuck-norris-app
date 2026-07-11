import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { QuoteCard } from './components/QuoteCard';
import { ErrorView } from './components/ErrorView';
import { useChuckNorris } from './hooks/useChuckNorris';

export default function App() {
  const { quote, iconUrl, loading, error, fetchQuote } = useChuckNorris();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#0d0d0d" />
      <View style={styles.container}>
        <Text style={styles.title}>Chuck Norris</Text>
        <Text style={styles.subtitle}>Daily Wisdom</Text>

        <View style={styles.content}>
          {loading && (
            <ActivityIndicator testID="activity-indicator" size="large" color="#e0a800" />
          )}
          {!loading && error && <ErrorView message={error} onRetry={fetchQuote} />}
          {!loading && !error && quote && <QuoteCard quote={quote} iconUrl={iconUrl} />}
        </View>

        <TouchableOpacity
          style={[styles.refreshButton, loading && styles.refreshButtonDisabled]}
          onPress={fetchQuote}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? 'Loading…' : 'New Quote'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 48,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#e0a800',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  refreshButton: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    backgroundColor: '#e0a800',
    borderRadius: 32,
    marginTop: 32,
  },
  refreshButtonDisabled: {
    opacity: 0.5,
  },
  refreshButtonText: {
    color: '#0d0d0d',
    fontSize: 18,
    fontWeight: '700',
  },
});
