import {
  Image,
  StyleSheet,
  Platform,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Get a fresh start</ThemedText>
        <ThemedText>
          <View style={styles.buttonStyles}>
            <TouchableOpacity
              onPress={() => router.push('/wallpaperScroll')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Wallpaper</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/scrollAnimation')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>ScrollAnimation</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/cardComponent')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>CardComponent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/Events')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Events</Text>
            </TouchableOpacity>
          </View>
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonStyles: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
