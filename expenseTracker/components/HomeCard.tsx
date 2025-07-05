import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { TransactionType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { where } from 'firebase/firestore';
import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

interface Totals {
  balance: number;
  income: number;
  expenses: number;
}

export default function HomeCard() {
  const {user} = useAuth();

  const {data: transactions, error, loading} = useFetchData<TransactionType>("transactions", [
    where("uid", "==", user?.uid),
  ]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [error]);

  const totals:Totals = useMemo(() => {
    
    if (!transactions || transactions.length === 0) {
      return { balance: 0, income: 0, expenses: 0 };
    }

    return transactions.reduce((acc: Totals, item: TransactionType) => {
      const amount = Number(item.amount) || 0;
      if (item.type === 'income') {
        acc.income += amount;
      } else if (item.type === 'expense') {
        acc.expenses += amount;
      }
    acc.balance = acc.income - acc.expenses;
      return acc;
    }, { balance: 0, income: 0, expenses: 0 });
  }, [transactions]);

  return (
    <View style={styles.card}>

      <View>
        {/* total balance */}
        <View style={styles.totalBalanceRow}>
          <Typo color={colors.primary} size={17} fontWeight={"500"}>Total Balance</Typo>
          <Entypo name="dots-three-horizontal" size={24} color={colors.primaryDark} />
        </View>

        <Typo style={{marginBottom: spacingY._30}} color={colors.primaryDark} size={30} fontWeight={"bold"}>
          $ {loading ? "----" : totals?.balance?.toFixed(2)}
        </Typo>

        {/* income and expense */}
        <View style={styles.stats}>
          {/* income */}
          <View style={{ gap: verticalScale(5)}}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Feather name="arrow-up" size={verticalScale(15)} color={colors.black} />
              </View>
              <Typo size={16} color={colors.neutral800} fontWeight={"500"}>
                Income
              </Typo>
            </View>
            <View style={{alignSelf: "center"}}>
              <Typo size={17} color={colors.primary} fontWeight={"600"}>$ {loading ? "----" : totals?.income?.toFixed(2)}</Typo>
            </View>
          </View>

          {/* expense */}
          <View style={{ gap: verticalScale(5)}}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <Feather name="arrow-down" size={verticalScale(15)} color={colors.black} />
              </View>
              <Typo size={16} color={colors.neutral800} fontWeight={"500"}>
                Expenses
              </Typo>
            </View>
            <View style={{alignSelf: "center"}}>
              <Typo size={17} color={colors.rose} fontWeight={"600"}>$ {loading ? "----" : totals?.expenses?.toFixed(2)}</Typo>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacingX._20,
    borderWidth: 1,
    borderColor: colors.neutral300
  },
  bgImage: {
    height: scale(210),
    width: "100%",
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsIcon: {
    backgroundColor: colors.neutral200,
    padding: spacingY._5,
    borderRadius: 50,
  },
  incomeExpense: {
    flexDirection: 'row',
    gap: spacingY._7,
    alignItems: 'center',
  }
});
