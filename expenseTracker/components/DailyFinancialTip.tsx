import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Typo from './Typo';

const mockTip = "Track your daily expenses to identify unnecessary spending and save more.";

const DailyFinancialTip = () => {
  return (
    <View style={styles.container}>
      <Typo size={18} fontWeight="600" color={colors.white} style={{ marginBottom: spacingY._10 }}>
        Daily Financial Tip
      </Typo>
      <Typo size={14} color={colors.neutral300} style={{ lineHeight: 20 }}>
        {mockTip}
      </Typo>
    </View>
  );
};

export default DailyFinancialTip;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral800,
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._17,
  },
});