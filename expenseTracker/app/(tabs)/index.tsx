import DailyFinancialTip from '@/components/DailyFinancialTip';
import ExpenseCategoryPieChart from '@/components/ExpenseCategoryPieChart';
import HomeCard from '@/components/HomeCard';
import IncomeExpenseChart from '@/components/IncomeExpenseChart';
import ScreenWrapper from '@/components/ScreenWrapper';
import StatCard from '@/components/StatCard';
import Typo from '@/components/Typo';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { fetchTotals, fetchTransactions } from '@/services/transactionService';
import { verticalScale } from '@/utils/styling';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const [displayRate, setDisplayRate] = useState<string>('0.0');
  const [savingsRate, setSavingsRate] = useState<number>(0);
  const [maxExpense, setMaxExpense] = useState<string>('0.0');

  useEffect(() => {
    if (user?.uid) {
      fetchTotals(user.uid).then((response) => {
        if (response.success) {
          const {totals} = response.data;
          const savings = totals?.income - totals?.expenses;
          const rate = totals?.income > 0 ? (savings / totals?.income) * 100 : 0;
          setSavingsRate(rate);
          setDisplayRate(rate.toFixed(1));
        }
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) {
      fetchTransactions(user.uid).then((response) => {
        if (response.success) {
          const { transactions } = response.data;
          // where type is expense and amount is largest
          const maxExpense = Math.max(...transactions.filter(tx => tx.type === 'expense').map(tx => tx.amount), 0);
          setMaxExpense(maxExpense.toFixed(1));
        }
      })
    }
  })

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        

        <ScrollView 
          contentContainerStyle={styles.scrollViewStyle}
          showsVerticalScrollIndicator={false}
        >
          {/* Enhanced Header */}
          <LinearGradient colors={[colors.primaryDark, colors.primary]} style={styles.header}>
            <View style={styles.welcomeSection}>
                <Typo size={verticalScale(14)} color={colors.neutral300} style={styles.welcomeText}>
                  Good morning
                </Typo>
                <Typo size={verticalScale(24)} fontWeight="700" color={colors.white} style={styles.nameText}>
                  {user?.name || 'User'}
                </Typo>
              </View>
              <View style={styles.headerIcon}>
                <Typo size={verticalScale(24)}>👋</Typo>
              </View>
          </LinearGradient>

          {/* Main Balance Card */}
          <View>
            <HomeCard />
          </View>

          {/* Stats Cards Section */}
          <View>
            <Typo size={verticalScale(18)} fontWeight="600" color={colors.text} style={styles.sectionTitle}>
              Financial Overview
            </Typo>
            <View style={styles.statsRow}>
              <StatCard 
                title='Savings Rate' 
                stat={`${displayRate}%`} 
                desc={savingsRate >= 0 ? 'Good job! Keep it up.' : 'Try to reduce your expenses.'} 
                trend='up'
                icon='💰'
              />
              <StatCard 
                title='Most expensive' 
                stat={`$${maxExpense}`} 
                desc='purchase' 
                trend='down'
                icon='🤑'
              />
            </View>
          </View>

          {/* Charts Section */}
          <View>
            <Typo size={verticalScale(18)} fontWeight="600" color={colors.text} style={styles.sectionTitle}>
              Analytics
            </Typo>
            
            {/* Income vs Expense Chart */}
            <View style={styles.chartWrapper}>
              <IncomeExpenseChart/>
            </View>

            {/* Expense Categories Pie Chart */}
            <View>
              <ExpenseCategoryPieChart />
            </View>
          </View>

          {/* Daily Tip Section */}
          <View style={styles.tipSection}>
            <DailyFinancialTip />
          </View>

          {/* Bottom spacing for better scroll experience */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._20,
    backgroundColor: colors.primaryDark,
    borderRadius: radius._15,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    marginBottom: spacingY._5,
    opacity: 0.8,
  },
  nameText: {
    lineHeight: verticalScale(28),
  },
  headerIcon: {
    width: verticalScale(50),
    height: verticalScale(50),
    borderRadius: verticalScale(25),
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewStyle: {
    paddingVertical: spacingY._20,
    gap: spacingY._20
  },
  sectionTitle: {
    marginBottom: spacingY._15,
    paddingLeft: spacingX._5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacingX._15,
  },
  chartWrapper: {
    borderRadius: spacingY._15,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: spacingY._20
  },
});