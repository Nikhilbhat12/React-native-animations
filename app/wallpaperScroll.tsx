import React, { useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Pressable,
  FlatList, // We'll wrap this in Reanimated
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { PEXELS_API_KEY } from '@env';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';

type SearchPayload = {
  total_results: number;
  page: number;
  per_page: number;
  photos: Photo[];
};

type Photo = {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: string;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
};

const { width } = Dimensions.get('window');
const _imageWidth = width * 0.7;
const _imageHeight = _imageWidth * 1.76;
const _spacing = 12;
const uri =
  'https://api.pexels.com/v1/search?query=mobile_wallpaper&orientation=portrait';

function PhotoItem({
  item,
  index,
  scrollX,
}: {
  item: Photo;
  index: number;
  scrollX: Animated.SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [1.6, 1, 1.6],
          ),
        },
        {
          rotate: `${interpolate(
            scrollX.value,
            [index - 1, index, index + 1],
            [10, 0, -15],
          )}deg`,
        },
      ],
    };
  });

  return (
    <View
      style={{
        width: _imageWidth,
        height: _imageHeight,
        overflow: 'hidden',
        borderRadius: 16,
      }}
    >
      <Animated.Image
        source={{ uri: item.src.portrait }}
        style={[{ flex: 1 }, animatedStyle]}
        resizeMode="cover"
      />
    </View>
  );
}

function BackdropPhotoItem({
  photo,
  index,
  scrollX,
}: {
  photo: Photo;
  index: number;
  scrollX: Animated.SharedValue<number>;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollX.value,
      [index - 1, index, index + 1],
      [0, 1, 0],
    ),
  }));

  return (
    <Animated.Image
      source={{ uri: photo.src.large }}
      style={[StyleSheet.absoluteFillObject, animatedStyle]}
      blurRadius={50}
    />
  );
}

export default function WallpaperScroll() {
  const { data, error, isLoading, isError } = useQuery<SearchPayload>({
    queryKey: ['wallpapers'],
    queryFn: async () => {
      const res = await fetch(uri, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch wallpapers: ${res.status}`);
      }
      return res.json();
    },
  });

  const flatListRef = useRef<FlatList<Photo>>(null);
  const scrollX = useSharedValue(0);

  const [currentIndex, setCurrentIndex] = useState(0);

  useAnimatedReaction(
    () => Math.round(scrollX.value),
    roundedIndex => {
      runOnJS(setCurrentIndex)(roundedIndex);
    },
  );

  const onScroll = useAnimatedScrollHandler(event => {
    scrollX.value = event.contentOffset.x / (_imageWidth + _spacing);
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error?.message}</Text>
      </View>
    );
  }

  const photos = data?.photos ?? [];
  const totalSlides = photos.length;

  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
    }
  };

  const goToNextSlide = () => {
    if (currentIndex < totalSlides - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Backdrop images */}
      <View style={StyleSheet.absoluteFillObject}>
        {photos.map((photo, index) => (
          <BackdropPhotoItem
            key={photo.id}
            photo={photo}
            index={index}
            scrollX={scrollX}
          />
        ))}
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={photos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <PhotoItem item={item} index={index} scrollX={scrollX} />
        )}
        horizontal
        snapToInterval={_imageWidth + _spacing}
        decelerationRate="fast"
        contentContainerStyle={{
          gap: _spacing,
          paddingHorizontal: (width - _imageWidth) / 2,
        }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      />

      {/* <View style={styles.arrowsContainer}>
        <Pressable style={styles.arrowLeft} onPress={goToPreviousSlide}>
          <Text style={styles.arrowText}>{'<'}</Text>
        </Pressable>

        <Pressable style={styles.arrowRight} onPress={goToNextSlide}>
          <Text style={styles.arrowText}>{'>'}</Text>
        </Pressable>
      </View> */}

      <View style={styles.paginationContainer}>
        {photos.map((_, i) => {
          const isActive = i === currentIndex;
          return (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: isActive ? '#333' : '#ccc' },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  // Arrows container
  arrowsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 250,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  arrowLeft: {
    position: 'absolute',
    left: 20,
  },
  arrowRight: {
    position: 'absolute',
    right: 20,
  },
  arrowText: {
    fontSize: 30,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    color: '#000',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 6,
  },
  // Dot pagination
  paginationContainer: {
    position: 'absolute',
    bottom: 130,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
