import React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import Card from './Card';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView, StyleSheet, View } from 'react-native';

const data = [
  {
    image: require('../assets/cards/image-product-1.jpg'),
  },
  {
    image: require('../assets/cards/image-product-2.jpg'),
  },
  {
    image: require('../assets/cards/image-product-3.jpg'),
  },
  {
    image: require('../assets/cards/image-product-4.jpg'),
  },
  {
    image: require('../assets/cards/image-product-1.jpg'),
  },
  {
    image: require('../assets/cards/image-product-2.jpg'),
  },
  {
    image: require('../assets/cards/image-product-3.jpg'),
  },
  {
    image: require('../assets/cards/image-product-4.jpg'),
  },
];

const maxVisibleItems = 3;

const CardContainer = () => {
  const animatedValue = useSharedValue(0);
  const currentIndex = useSharedValue(0);
  const prevIndex = useSharedValue(0);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.cardsContainer}>
          {data.map((item, index) => (
            <Card
              maxVisibleItems={maxVisibleItems}
              item={item}
              index={index}
              dataLength={data.length}
              animatedValue={animatedValue}
              currentIndex={currentIndex}
              prevIndex={prevIndex}
              key={index}
            />
          ))}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CardContainer;
