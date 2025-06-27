import Loading from '@/components/Loading';
import { firestore } from '@/config/firebase';
import { expenseCategories } from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { fetchTotals } from '@/services/transactionService';
import { TransactionType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import Typo from './Typo';

export default function ExpenseCategoryPieChart()  {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);

  useEffect(() => {
    if (user?.uid) fetchCategoryData(user.uid);
  }, [user]);

  useEffect(() => {
    if (user?.uid) {
      fetchTotals(user.uid).then((response) => {
        if (response.success) {
          const {totalsData} = response.data;
          return totalsData;
        }
      });
    }
  }, [user?.uid]);

  const fetchCategoryData = async (uid: string) => {
    try {
      setLoading(true);

      const transactionQuery = query(
        collection(firestore, 'transactions'),
        where('uid', '==', uid),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(transactionQuery);
      const totals: Record<string, number> = {};

      snapshot.forEach((doc) => {
        const transaction = doc.data() as TransactionType;
        if (transaction.type === 'expense') {
          const category = transaction.category!;
          totals[category] = (totals[category] || 0) + transaction.amount!;
        }
      });

      const totalExpenses = Object.values(totals).reduce((sum, val) => sum + val, 0);
      setTotalExpenses(totalExpenses);

      const pieData = Object.entries(totals).map(([categoryKey, amount]) => {
        const category = expenseCategories[categoryKey];
        const maxAmount = Math.max(...Object.values(totals));
        return {
          label: category.label,
          value: amount,
          color: category.bgColor,
          focused: amount === maxAmount,
          text: totalExpenses > 0 ? `${((amount / totalExpenses) * 100).toFixed(0)}%` : '0%',
          categoryKey
        };
      });

      // Sort by value (descending) for better visual hierarchy
      pieData.sort((a, b) => b.value - a.value);
      setChartData(pieData);
    } catch (err) {
      console.log('Error fetching category data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFocusedCategory = () => {
    return chartData.find(item => item.focused);
  };

  const renderLegendComponent = () => {
    if (chartData.length === 0) return null;

    return (
      <View style={styles.legendContainer}>
        <Typo size={verticalScale(16)} fontWeight="600" color={colors.textDark} style={styles.legendTitle}>
          Category Breakdown
        </Typo>
        <View style={styles.legendGrid}>
          {chartData.slice(0, 6).map((item, index) => (
            <View key={item.label} style={styles.legendItem}>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Typo size={verticalScale(13)} fontWeight="500" color={item.color} style={styles.legendLabel}>
                  {item.label}
                </Typo>
              </View>
              <View style={styles.legendValues}>
                <Typo size={verticalScale(14)} fontWeight="700" color={colors.textDark}>
                  ${item.value.toFixed(0)}
                </Typo>
                <Typo size={verticalScale(11)} color={colors.textDark}>
                  {item.text}
                </Typo>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderCenterLabel = () => {
    const focusedItem = getFocusedCategory();
    if (!focusedItem) return null;

    return (
      <View style={styles.centerLabelContainer}>
        <Typo size={verticalScale(24)} fontWeight="800" color={focusedItem.color} style={styles.centerAmount}>
          ${focusedItem.value.toFixed(0)}
        </Typo>
        <Typo size={verticalScale(12)} fontWeight="600" color={colors.textDark} style={styles.centerCategory}>
          {focusedItem.label}
        </Typo>
        <Typo size={verticalScale(11)} color={colors.neutral500} style={styles.centerPercentage}>
          {focusedItem.text} of total
        </Typo>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading color={colors.primary} />
        <Typo size={verticalScale(14)} color={colors.textDark} style={styles.loadingText}>
          Loading expense categories...
        </Typo>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Typo size={verticalScale(20)} fontWeight="700" color={colors.white}>
          🥧 Expense Categories
        </Typo>
        <Typo size={verticalScale(13)} color={colors.neutral200} style={styles.headerSubtitle}>
          Where your money goes
        </Typo>
        {totalExpenses > 0 && (
          <View style={styles.totalContainer}>
            <Typo size={verticalScale(11)} color={colors.white}>Total Expenses</Typo>
            <Typo size={verticalScale(18)} fontWeight="700" color={colors.rose}>
              ${totalExpenses.toFixed(2)}
            </Typo>
          </View>
        )}
      </View>

      {chartData.length > 0 ? (
        <View style={styles.chartSection}>
          {/* Pie Chart */}
          <View style={styles.pieChartContainer}>
            <PieChart
              data={chartData}
              sectionAutoFocus
              radius={scale(120)}
              innerRadius={scale(75)}
              focusOnPress
              isAnimated
              animationDuration={1000}
              textColor={colors.white}
              textSize={verticalScale(10)}
              fontWeight="600"
              strokeColor={colors.neutral300}
              strokeWidth={2}
              centerLabelComponent={renderCenterLabel}
              labelsPosition="mid"
            />
          </View>

          {/* Legend */}
          {renderLegendComponent()}
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <Typo size={verticalScale(48)} style={styles.noDataEmoji}>🥧</Typo>
          <Typo size={verticalScale(16)} fontWeight="600" color={colors.textLight} style={styles.noDataTitle}>
            No Expense Data
          </Typo>
          <Typo size={verticalScale(13)} color={colors.neutral500} style={styles.noDataDesc}>
            Start tracking your expenses to see category breakdown
          </Typo>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
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
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderTopWidth: 0
  },
  loadingContainer: {
    backgroundColor: colors.neutral100,
    borderRadius: radius._20,
    paddingVertical: spacingY._40,
    alignItems: 'center',
    gap: spacingY._15,
  },
  loadingText: {
    fontWeight: '500',
  },
  headerContainer: {
    paddingHorizontal: spacingX._20,
    paddingTop: spacingY._20,
    paddingBottom: spacingY._15,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral200,
    backgroundColor: colors.primary,
  },
  headerSubtitle: {
    marginTop: spacingY._5,
    opacity: 0.8,
  },
  totalContainer: {
    marginTop: spacingY._15,
    padding: spacingX._15,
    backgroundColor: colors.primaryDark,
    borderRadius: radius._12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartSection: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._25,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginBottom: spacingY._30,
  },
  centerLabelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacingY._3,
  },
  centerAmount: {
    lineHeight: verticalScale(28),
  },
  centerCategory: {
    textAlign: 'center',
    maxWidth: scale(80),
  },
  centerPercentage: {
    textAlign: 'center',
  },
  legendContainer: {
    gap: spacingY._15,
  },
  legendTitle: {
    textAlign: 'center',
    marginBottom: spacingY._5,
  },
  legendGrid: {
    gap: spacingY._12,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._12,
    backgroundColor: colors.neutral50,
    borderRadius: radius._12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legendDot: {
    width: verticalScale(12),
    height: verticalScale(12),
    borderRadius: verticalScale(6),
    marginRight: spacingX._10,
  },
  legendLabel: {
    flex: 1,
  },
  legendValues: {
    alignItems: 'flex-end',
    gap: spacingY._5,
  },
  noDataContainer: {
    paddingVertical: spacingY._50,
    alignItems: 'center',
    gap: spacingY._15,
  },
  noDataEmoji: {
    opacity: 0.3,
  },
  noDataTitle: {
    textAlign: 'center',
  },
  noDataDesc: {
    textAlign: 'center',
    lineHeight: verticalScale(18),
    maxWidth: '80%',
  },
});