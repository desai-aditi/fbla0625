import Loading from '@/components/Loading';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from '@/services/transactionService';
import { scale, verticalScale } from '@/utils/styling';
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import Typo from './Typo';

export default function IncomeExpenseChart() {
  const {user} = useAuth()
  const [activeIndex, setActiveIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (activeIndex === 0) {
      getWeeklyStats();
    }
    if (activeIndex === 1) {
      getMonthlyStats();
    }
    if (activeIndex === 2) {
      getYearlyStats();
    }
  }, [activeIndex]);

  const getWeeklyStats = async () => {
    setChartLoading(true);
    let res = await fetchWeeklyStats(user?.uid as string);
    setChartLoading(false);
    if(res.success){
      setChartData(res.data.stats);
      setTransactions(res.data.transactions);
    } else {
      Alert.alert("Error", res.msg)
    }
  }

  const getMonthlyStats = async () => {
    setChartLoading(true);
    let res = await fetchMonthlyStats(user?.uid as string);
    setChartLoading(false);
    if(res.success){
      setChartData(res.data.stats);
      setTransactions(res.data.transactions);
    } else {
      Alert.alert("Error", res.msg)
    }
  }

  const getYearlyStats = async () => {
    setChartLoading(true);
    let res = await fetchYearlyStats(user?.uid as string);
    setChartLoading(false);
    if(res.success){
      setChartData(res.data.stats);
      setTransactions(res.data.transactions);
    } else {
      Alert.alert("Error", res.msg)
    }
  }

  const getPeriodText = () => {
    switch (activeIndex) {
      case 0: return 'Weekly';
      case 1: return 'Monthly';
      case 2: return 'Yearly';
      default: return 'Weekly';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.titleContainer}>
          <Typo size={verticalScale(20)} fontWeight="700" color={colors.textDark}>
            📊 Income vs Expenses
          </Typo>
          <Typo size={verticalScale(13)} color={colors.textMuted} style={styles.subtitle}>
            {getPeriodText()} breakdown of your finances
          </Typo>
        </View>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentContainer}>
        <SegmentedControl 
          values={["Weekly", "Monthly", "Yearly"]}
          selectedIndex={activeIndex}
          onChange={(event) => {
            setActiveIndex(event.nativeEvent.selectedSegmentIndex);
          }}
          style={styles.segmentStyle}
          tintColor={colors.primary}
          backgroundColor={colors.neutral100}
          activeFontStyle={styles.segmentActiveFontStyle}
          fontStyle={styles.segmentFontStyle}
        />
      </View>

      {/* Chart Section */}
      <View style={styles.chartSection}>
        <View style={styles.chartContainer}>
          {chartData.length > 0 ? (
            <View style={styles.chartWrapper}>
              {/* Chart Legend */}
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                  <Typo size={verticalScale(12)} color={colors.textDark}>Income</Typo>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: colors.rose }]} />
                  <Typo size={verticalScale(12)} color={colors.textDark}>Expenses</Typo>
                </View>
              </View>

              <BarChart 
                data={chartData} 
                barWidth={scale(16)}
                spacing={[1, 2].includes(activeIndex) ? scale(30) : scale(20)}
                roundedBottom
                roundedTop
                hideRules
                yAxisLabelPrefix='$'
                yAxisThickness={0}
                xAxisThickness={1}
                xAxisColor={colors.neutral200}
                yAxisLabelWidth={[1, 2].includes(activeIndex) ? scale(42) : scale(38)}
                yAxisTextStyle={styles.yAxisTextStyle}
                xAxisLabelTextStyle={styles.xAxisLabelStyle}
                noOfSections={4}
                minHeight={8}
                isAnimated
                animationDuration={800}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Typo size={verticalScale(48)} style={styles.noDataEmoji}>📈</Typo>
              <Typo size={verticalScale(16)} fontWeight="600" color={colors.text} style={styles.noDataTitle}>
                No Data Available
              </Typo>
              <Typo size={verticalScale(13)} color={colors.neutral500} style={styles.noDataDesc}>
                Start adding transactions to see your {getPeriodText().toLowerCase()} breakdown
              </Typo>
            </View>
          )}

          {/* Loading Overlay */}
          {chartLoading && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingContainer}>
                <Loading color={colors.primary} />
                <Typo size={verticalScale(14)} color={colors.textLight} style={styles.loadingText}>
                  Loading {getPeriodText().toLowerCase()} data...
                </Typo>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  headerSection: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
    paddingBottom: spacingY._15,
    backgroundColor: colors.white,
  },
  titleContainer: {
    gap: spacingY._5,
  },
  subtitle: {
    opacity: 0.8,
  },
  segmentContainer: {
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._20,
  },
  segmentStyle: {
    height: scale(42),
    borderRadius: radius._12,
  },
  segmentActiveFontStyle: {
    fontSize: verticalScale(14),
    fontWeight: "700",
    color: colors.white,
  },
  segmentFontStyle: {
    fontSize: verticalScale(14),
    fontWeight: "500",
    color: colors.textMuted,
  },
  chartSection: {
    paddingHorizontal: spacingX._20,
    paddingBottom: spacingY._25,
  },
  chartContainer: {
    position: "relative",
    minHeight: verticalScale(250),
    backgroundColor: colors.neutral50,
    borderRadius: radius._15,
    padding: spacingX._15,
  },
  chartWrapper: {
    flex: 1,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacingX._20,
    marginBottom: spacingY._20,
    paddingVertical: spacingY._10,
    backgroundColor: colors.white,
    borderRadius: radius._10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._7,
  },
  legendDot: {
    width: verticalScale(8),
    height: verticalScale(8),
    borderRadius: verticalScale(4),
  },
  yAxisTextStyle: {
    color: colors.text,
    fontSize: verticalScale(11),
    fontWeight: '500',
  },
  xAxisLabelStyle: {
    color: colors.text,
    fontSize: verticalScale(11),
    fontWeight: '500',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacingY._40,
  },
  noDataEmoji: {
    opacity: 0.3,
    marginBottom: spacingY._15,
  },
  noDataTitle: {
    marginBottom: spacingY._7,
  },
  noDataDesc: {
    textAlign: 'center',
    lineHeight: verticalScale(18),
    maxWidth: '80%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius._15,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: spacingY._15,
  },
  loadingText: {
    fontWeight: '500',
  },
});