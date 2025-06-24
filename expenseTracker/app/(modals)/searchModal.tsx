import BackButton from '@/components/BackButton';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import TransactionList from '@/components/TransactionList';
import { spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { TransactionType } from '@/types';
import { orderBy, where } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function SearchModal() {
  const { user, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const constraints = [
    where("uid", "==", user?.uid),
    orderBy("date", "desc")
  ];

  const {data: allTransactions, error, loading: transactionsLoading} = useFetchData<TransactionType>("transactions", constraints);

  const filteredTransactions = allTransactions?.filter((item) => {
    if(search.length>1) {
        if (
            item.category?.toLowerCase()?.includes(search?.toLowerCase()) || 
            item.type?.toLowerCase()?.includes(search?.toLowerCase()) || 
            item.description?.toLowerCase()?.includes(search?.toLowerCase())
        ) {
            return true;
        }
        return false;
    }
    return true;
  });

  return (
   <ModalWrapper>
      <View style={styles.container}>
        <Header 
        title="Search"
        leftIcon={<BackButton />} 
        style={{marginBottom: spacingY._10}}/>
      
        <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
              <Input 
                placeholder='Search...'
                value={search}
                onChangeText={(value) => setSearch(value)}
              />
            </View>

            <View>
                <TransactionList 
                    loading={transactionsLoading}
                    data={filteredTransactions}
                    emptyListMessage='No transactions found'
                />
            </View>
        </ScrollView>

        
      </View>
    </ModalWrapper>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20
  },
  form: {
    gap: spacingY._20,
    marginTop: spacingY._15
  },
  inputContainer: {
    gap: spacingY._10,
    flex: 1,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5
  }
});
