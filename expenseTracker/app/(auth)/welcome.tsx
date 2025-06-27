import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, radius, shadows, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function Welcome() {
  const router = useRouter();

  return (
    <ScreenWrapper style={{ backgroundColor: colors.bg }}>
      <View style={styles.container}>
        {/* login button and image */}
        <View>
          <TouchableOpacity onPress={()=> router.push('/(auth)/login')} style={styles.loginButton}>
            <Typo fontWeight={"600"} color={colors.primary}>Sign In</Typo>
          </TouchableOpacity>
          <Animated.Image 
            entering={FadeIn.duration(1000)}
            source={require("../../assets/images/partial-react-logo.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Animated.View 
            entering={FadeInDown.duration(1000).springify().damping(12)} 
            style={{alignItems: "center"}}
          >
            <Typo size={32} style={{textAlign: 'center'}} fontWeight={"800"} color={colors.white}>💸</Typo>
            <Typo size={32} style={{textAlign: 'center'}} fontWeight={"800"} color={colors.white}>Take control of your finances today.</Typo>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.duration(1000).delay(100).springify().damping(12)} 
            style={{alignItems: 'center', gap: 2}}
          >
            <Typo size={17} color={colors.neutral300}>Organize your finances</Typo>
            <Typo size={17} color={colors.neutral300}>for a better tomorrow.</Typo>
          </Animated.View>

          {/* button */}
          <Animated.View 
            entering={FadeInDown.duration(1000).delay(200).springify().damping(12)}
            style={styles.buttonContainer}
          >
            <Button onPress={()=> router.push('/(auth)/register')} style={styles.getStartedButton}>
              <Typo size={18} color={colors.white} fontWeight={"700"}>Get Started</Typo>
            </Button>
          </Animated.View >
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.bg,
  },
  welcomeImage: {
    width: '100%',
    height: verticalScale(200),
    alignSelf: 'center',
    marginVertical: spacingY._40,
  },
  loginButton: {
    alignSelf: 'flex-end',
    marginRight: spacingX._20,
    marginTop: spacingY._15,
    paddingVertical: spacingY._8,
    paddingHorizontal: spacingX._16,
    backgroundColor: colors.surfaceBg,
    borderRadius: radius._20,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.small,
  },
  footer: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    paddingVertical: spacingY._30,
    paddingHorizontal: spacingX._20,
    gap: spacingY._25,
    borderRadius: radius._30,
    marginBottom: spacingY._20,
    ...shadows.large,
    textAlign: 'center'
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: spacingX._25,
  },
  getStartedButton: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius._15,
    ...shadows.medium,
  }
});