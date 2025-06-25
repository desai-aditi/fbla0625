import Loading from '@/components/Loading';
import { firestore } from '@/config/firebase';
import { expenseCategories } from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { TransactionType } from '@/types';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import Typo from './Typo';

const ExpenseCategoryPieChart = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) fetchCategoryData(user.uid);
  }, [user]);

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

      const pieData = Object.entries(totals).map(([categoryKey, amount]) => {
        const category = expenseCategories[categoryKey];
        return {
          label: category.label,
          value: amount,
          color: category.bgColor,
        };
      });

      setChartData(pieData);
    } catch (err) {
      console.log('Error fetching category data:', err);
    } finally {
      setLoading(false);
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const chartSize = screenWidth * 0.7;

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Typo size={18} fontWeight="600" color={colors.white} style={{ marginBottom: spacingY._15 }}>
        Expense Categories
      </Typo>
      {chartData.length > 0 ? (
        <PieChart
          data={chartData}
          
        />
      ) : (
        <Typo size={14} color={colors.neutral400}>
          No expense data to display.
        </Typo>
      )}
    </View>
  );
};

export default ExpenseCategoryPieChart;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral800,
    paddingVertical: spacingY._15,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._17,
    alignItems: 'center',
  },
});