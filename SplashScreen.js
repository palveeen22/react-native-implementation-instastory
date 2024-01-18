import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import LottieView from 'lottie-react-native'

import Animation from './animation.json'

// interface SplashScreenProps {
//   stopAnimation: Function;
// }

const SplashScreen /*: React.FC<SplashScreenProps> */ = ({ stopAnimation }) => (
  <View style={styles.container}>
    <LottieView
      source={Animation}
      autoPlay
      loop={false}
      onAnimationFinish={() => {
        stopAnimation(true)
      }}
    />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4D2286',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default SplashScreen
