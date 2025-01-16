import { Dimensions, StyleSheet, Text, View } from 'react-native';
const { width, height } = Dimensions.get('screen');

const SPACING = 20;
const AVATAR_SIZE = 70;
const ScrollAnimation = () => {
  return (
    <View style={styles.container}>
      <Text>ScrollAnimation</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
});
export default ScrollAnimation;
