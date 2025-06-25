import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Typo from './Typo';

interface SavingsRateCardProps {
  income: number;
  expenses: number;
}

const SavingsRateCard = ({ income, expenses }: SavingsRateCardProps) => {
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  const displayRate = savingsRate.toFixed(1);

  return (
    <View style={styles.container}>
      <Typo size={18} fontWeight="600" color={colors.white}>
        Savings Rate
      </Typo>
      <Typo size={32} fontWeight="700" color={savingsRate >= 0 ? colors.green : colors.rose}>
        {savingsRate >= 0 ? `${displayRate}%` : '0%'}
      </Typo>
      <Typo size={14} color={colors.neutral400}>
        {savingsRate >= 0 ? 'Good job! Keep it up.' : 'Try to reduce your expenses.'}
      </Typo>
    </View>
  );
};

export default SavingsRateCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral800,
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._17,
    alignItems: 'center',
    gap: spacingY._7,
  },
});