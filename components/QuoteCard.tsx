import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface QuoteCardProps {
  quote: string;
  iconUrl: string | null;
}

export function QuoteCard({ quote, iconUrl }: QuoteCardProps) {
  return (
    <View style={styles.card}>
      {iconUrl ? (
        <Image source={{ uri: iconUrl }} style={styles.icon} />
      ) : null}
      <Text style={styles.quote}>{quote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
  },
  quote: {
    fontSize: 20,
    lineHeight: 30,
    color: '#f0f0f0',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
