import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Typo from './Typo';

interface StatCardProps {
  title?: string;
  stat?: string;
  desc?: string;
  style?: ViewStyle;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const StatCard = ({
  title = "", 
  stat = "", 
  desc = "", 
  style, 
  icon = "📊",
  trend = 'neutral',
  trendValue = ""
}: StatCardProps) => {

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return colors.primary;
      case 'down':
        return colors.rose;
      default:
        return colors.neutral400;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➖';
    }
  };

  return (
    <View style={[styles.container, style]}>
      {/* Header with icon */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Typo size={verticalScale(16)}>{icon}</Typo>
        </View>
        <Typo size={verticalScale(12)} color={colors.neutral50} style={styles.titleText}>
          {title}
        </Typo>
      </View>

      {/* Main stat */}
      <View style={styles.statContainer}>
        <Typo size={verticalScale(28)} fontWeight="800" color={colors.white} style={styles.statText}>
          {stat}
        </Typo>
        
        {/* Trend indicator */}
        {trendValue && (
          <View style={styles.trendContainer}>
            <Typo size={verticalScale(14)} color={getTrendColor()}>
              {getTrendIcon()}
            </Typo>
            <Typo size={verticalScale(12)} fontWeight="600" color={getTrendColor()}>
              {trendValue}
            </Typo>
          </View>
        )}
      </View>

      {/* Description */}
      <View style={styles.descContainer}>
        <Typo size={verticalScale(11)} color={colors.neutral100} style={styles.descText}>
          {desc}
        </Typo>
      </View>

      {/* Subtle background decoration */}
      <View style={styles.backgroundDecoration} />
    </View>
  );
};

export default StatCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingVertical: spacingY._20,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._20,
    width: '48%',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacingY._12,
  },
  iconContainer: {
    marginRight: spacingX._3,
  },
  titleText: {
    letterSpacing: 0.5,
    flex: 1,
  },
  statContainer: {
    marginBottom: spacingY._10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statText: {
    lineHeight: verticalScale(32),
    flex: 1,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: spacingX._7,
    paddingVertical: spacingY._5,
    borderRadius: radius._10,
  },
  descContainer: {
    marginTop: 'auto',
  },
  descText: {
    lineHeight: verticalScale(14),
    opacity: 0.8,
  },
  backgroundDecoration: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primarySoft,
    opacity: 0.1
  },
});