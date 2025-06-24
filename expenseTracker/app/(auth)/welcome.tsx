import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import React  from 'react';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import Button from '@/components/Button';
import { verticalScale } from '@/utils/styling';
import { colors, spacingX, spacingY } from '@/constants/theme';
// import { colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

export default function Welcome() {
  const router = useRouter();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* login button and image */}
        <View>
          <TouchableOpacity onPress={()=> router.push('/(auth)/login')} style={styles.loginButton}>
            <Typo fontWeight={"500"}>Sign In</Typo>
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
            <Typo size={30} fontWeight={"800"}>Take control of</Typo>
            <Typo size={30} fontWeight={"800"}>your finances today.</Typo>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.duration(1000).delay(100).springify().damping(12)} 
            style={{alignItems: 'center', gap: 2}}
          >
            <Typo size={17}>Organize your finances</Typo>
            <Typo size={17}>for a better tomorrow.</Typo>
          </Animated.View>

          {/* button */}
          <Animated.View 
            entering={FadeInDown.duration(1000).delay(200).springify().damping(12)}
            style={styles.buttonContainer}
          >
            <Button onPress={()=> router.push('/(auth)/register')}>
              <Typo size={22} color={colors.neutral900} fontWeight={600}>Get Started</Typo>
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
  },
  welcomeImage: {
    width: '100%',
    height: verticalScale(200),
    alignSelf: 'center',
    marginTop: verticalScale(100),
  },
  loginButton: {
    alignSelf: 'flex-end',
    marginRight: spacingX._20,
  },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: 'center',
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
    shadowOpacity: 0.15,
    shadowRadius: 25,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: spacingX._25,
  }
});
