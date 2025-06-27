import { colors, radius, shadows, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Typo from './Typo';

const mockTip = "Track your daily expenses to clarify spending and save some for when you want and need it.";

const DailyFinancialTip = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Typo size={verticalScale(18)} style={styles.icon}>
            💡
          </Typo>
        </View>
        <Typo 
          size={verticalScale(16)} 
          fontWeight="700" 
          color={colors.textLight} 
          style={styles.title}
        >
          Tip of the Day!
        </Typo>
        <View style={styles.badge}>
          <Typo size={verticalScale(10)} fontWeight="600" color={colors.textLight}>
            NEW
          </Typo>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <Typo 
        size={verticalScale(14)} 
        color={colors.textLight} 
        style={styles.tipText}
      >
        {mockTip}
      </Typo>
      
      {/* Decorative element */}
      <View style={styles.decorativeBar} />
    </View>
  );
};

export default DailyFinancialTip;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingVertical: spacingY._20,
    paddingHorizontal: spacingX._20,
    borderRadius: radius._16,
    width: '100%',
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.neutral700,
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacingY._16,
  },
  iconContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius._12,
    padding: spacingX._10,
    marginRight: spacingX._12,
    ...shadows.small,
  },
  icon: {
    textAlign: 'center',
  },
  title: {
    flex: 1,
    letterSpacing: 0.5,
  },
  badge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacingX._8,
    paddingVertical: spacingY._5,
    borderRadius: radius._8,
    ...shadows.small,
  },
  divider: {
    height: 1,
    backgroundColor: colors.primaryLight,
    marginBottom: spacingY._16,
    opacity: 0.3,
  },
  tipText: {
    letterSpacing: 0.3,
    lineHeight: verticalScale(22),
  },
  decorativeBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primaryLight,
  },
});