import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import TransactionList from '@/components/TransactionList';
import Typo from '@/components/Typo';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { TransactionType } from '@/types';
import { verticalScale } from '@/utils/styling';
import Ionicons from '@expo/vector-icons/Ionicons';
import { orderBy, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Ledger() {
  const { user } = useAuth();

  // Search state and toggle for input box
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const constraints = [
    where('uid', '==', user?.uid),
    orderBy('date', 'desc'),
  ];

  const { data: recentTransactions, loading } = useFetchData<TransactionType>(
    'transactions',
    constraints
  );

  // Filter transactions based on search query (category, type, description)
  const filteredTransactions = recentTransactions?.filter((item) => {
    if (search.length > 1) {
      const lowerSearch = search.toLowerCase();
      return (
        item.category?.toLowerCase().includes(lowerSearch) ||
        item.type?.toLowerCase().includes(lowerSearch) ||
        item.description?.toLowerCase().includes(lowerSearch) || 
        item.amount?.toString().includes(lowerSearch)
      );
    }
    return true;
  });

  return (
    <ScreenWrapper barStyle='dark-content'>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Typo size={24} fontWeight="700" color={colors.textLight}>
              Transactions
            </Typo>

            <TouchableOpacity
              onPress={() => setShowSearch((prev) => !prev)}
              style={[
                styles.searchIcon, 
                showSearch && styles.searchIconActive
              ]}
            >
              <Ionicons
                name={showSearch ? "close" : "search"}
                size={verticalScale(20)}
                color={showSearch ? colors.primary500 : colors.white}
              />
            </TouchableOpacity>
          </View>

          {/* Conditionally render search input with animation */}
          {showSearch && (
            <View style={styles.searchContainer}>
              <Input
                containerStyle={styles.searchInputContainer}
                placeholder="Search by category, type, description, or amount"
                size={15}
                color={colors.textLight}
                inputStyle={styles.searchInput}
                onChangeText={(text) => setSearch(text)}
              />
            </View>
          )}
        </View>

        <View style={styles.listContainer}>
          <TransactionList
            data={filteredTransactions}
            loading={loading}
            emptyListMessage="No transactions found"
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacingY._10,
    backgroundColor: colors.bg
  },
  headerContainer: {
    backgroundColor: colors.primaryDark,
    borderRadius: radius._15,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.neutral300,
    marginBottom: spacingY._20,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._15
  },
  searchIcon: {
    backgroundColor: colors.primary500,
    padding: spacingX._12,
    borderRadius: radius._12,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIconActive: {
    backgroundColor: colors.white,
  },
  searchContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.neutral300,
    backgroundColor: colors.primaryDark,
    borderRadius: radius._12
  },
  searchInputContainer: {
    marginBottom: 0,
    borderWidth: 0,
  },
  searchInput: {
    borderWidth: 0,
    color: colors.textLight,
    elevation: 1,
  },
  listContainer: {
    paddingBottom: spacingY._40,
  },
});