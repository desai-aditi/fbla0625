import ScreenWrapper from '@/components/ScreenWrapper';
import TransactionList from '@/components/TransactionList';
import { spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { TransactionType } from '@/types';
import { limit, orderBy, where } from 'firebase/firestore';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';


export default function Ledger() {
  const {user} = useAuth();

  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc"),
    limit(30)
  ];

  const {data: recentTransactions, error, loading} = useFetchData<TransactionType>("transactions", constraints);

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <TransactionList data={recentTransactions} loading={loading} emptyListMessage='No transactions found' title={"Recent Transactions"} />
      </ScrollView>
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacingX._20,
    paddingVertical: spacingY._10
  }
});