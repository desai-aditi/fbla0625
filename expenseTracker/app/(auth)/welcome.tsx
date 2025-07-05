import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, radius, shadows, spacingX, spacingY } from '@/constants/theme';
import { scale } from '@/utils/styling';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function Welcome() {
  const router = useRouter();
  
  return (
    <ScreenWrapper style={{ backgroundColor: colors.bg }}>
      <View style={styles.container}>

        {/* Main content area */}
        <View style={styles.mainContent}>
          {/* Logo section with branding */}
          <Animated.View 
            entering={FadeIn.duration(1200).delay(200)}
            style={styles.brandingSection}
          >
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons name="clover" size={scale(140)} color={colors.primaryDark} />
            </View>
            
            <Animated.View 
              entering={FadeInUp.duration(1000).delay(600)}
              style={styles.brandTextContainer}
            >
              <Typo size={42} fontWeight={"800"} color={colors.primary} style={styles.appName}>
                fiscus.
              </Typo>
              <Typo size={16} color={colors.neutral600} style={styles.tagline}>
                Smart Finance Management
              </Typo>
            </Animated.View>
          </Animated.View>
        </View>

        {/* Footer */}
        <LinearGradient colors={['#1b4332', '#184e77']} style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).delay(800).springify().damping(12)}
            style={styles.footerContent}
          >
            <View style={styles.heroSection}>
              <Typo size={32} style={styles.heroEmoji}>💸</Typo>
              <Typo size={28} style={styles.heroText} fontWeight={"800"} color={colors.white}>
                Take control of your finances today.
              </Typo>
            </View>
            
            <Animated.View
              entering={FadeInDown.duration(1000).delay(900).springify().damping(12)}
              style={styles.subtitleContainer}
            >
              <Typo size={16} color={colors.neutral300} style={styles.subtitle}>
                Organize your finances for a better tomorrow.
              </Typo>
            </Animated.View>

            {/* Button */}
            <Animated.View
              entering={FadeInDown.duration(1000).delay(1000).springify().damping(12)}
              style={styles.buttonContainer}
            >
              <Button onPress={()=> router.push('/(auth)/register')} style={styles.getStartedButton}>
                <Typo size={18} color={colors.white} fontWeight={"700"}>Get Started</Typo>
              </Button>
            </Animated.View>
          </Animated.View>
        </LinearGradient>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingTop: spacingY._15,
    paddingHorizontal: spacingX._20,
    alignItems: 'flex-end',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacingX._20,
  },
  brandingSection: {
    alignItems: 'center',
  },
  logoContainer: {
    width: scale(180),
    height: scale(180),
    borderRadius: 30,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingY._25,
    ...shadows.large,
    elevation: 8,
  },
  logo: {
    width: scale(140),
    height: scale(140),
  },
  brandTextContainer: {
    alignItems: 'center',
    gap: spacingY._8,
  },
  appName: {
    textAlign: 'center',
    letterSpacing: -1,
  },
  tagline: {
    textAlign: 'center',
    opacity: 0.8,
  },
  loginButton: {
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._20,
    backgroundColor: colors.surfaceBg,
    borderRadius: radius._20,
    borderWidth: 1.5,
    borderColor: colors.primary,
    ...shadows.small,
  },
  footer: {
    borderRadius: radius._30,
    paddingVertical: spacingY._35,
    paddingHorizontal: spacingX._20,
    marginBottom: spacingY._30,
    ...shadows.large,
  },
  footerContent: {
    alignItems: 'center',
    gap: spacingY._25,
  },
  heroSection: {
    alignItems: 'center',
    gap: spacingY._15,
  },
  heroEmoji: {
    fontSize: 32,
  },
  heroText: {
    textAlign: 'center',
    lineHeight: 36,
    paddingHorizontal: spacingX._10,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
  },
  getStartedButton: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius._15,
    ...shadows.medium,
  }
});