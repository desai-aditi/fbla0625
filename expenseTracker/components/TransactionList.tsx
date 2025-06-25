import { expenseCategories, incomeCategory } from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { TransactionItemProps, TransactionListType, TransactionType } from '@/types';
import { verticalScale } from '@/utils/styling';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { format, isToday, isYesterday } from 'date-fns';
import { useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Loading from './Loading';
import Typo from './Typo';

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage
}: TransactionListType) => {
  const router = useRouter();
  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transactionModal",
      params: {
        id: item?.id,
        type: item?.type,
        amount: item?.amount?.toString(),
        category: item?.category,
        date: (item.date as Timestamp)?.toDate()?.toISOString(),
        description: item?.description,
        uid: item?.uid
      }
    })
  };

  // Group transactions by date
  const grouped = data.reduce((acc: Record<string, TransactionType[]>, item) => {
    const dateObj = (item.date as Timestamp).toDate();
    let label = format(dateObj, "EEE, MMMM d");

    if (isToday(dateObj)) label = "Today";
    else if (isYesterday(dateObj)) label = "Yesterday";

    if (!acc[label]) acc[label] = [];
    acc[label].push(item);
    return acc;
  }, {});

  const sortedDateKeys = Object.keys(grouped);

  return (
    <View style={styles.container}>
      {title && (
        <Typo size={20} fontWeight={"500"}>{title}</Typo>
      )}

      {sortedDateKeys.length > 0 ? (
        sortedDateKeys.map((groupLabel, sectionIndex) => (
          <View key={groupLabel}>
            <Typo size={16} fontWeight="600" style={styles.dateHeading}>{groupLabel}</Typo>
            {grouped[groupLabel].map((item, index) => (
              <TransactionItem
                key={item.id}
                item={item}
                index={sectionIndex * 100 + index}
                handleClick={handleClick}
              />
            ))}
          </View>
        ))
      ) : (
        !loading && (
          <Typo size={16} color={colors.neutral400} style={{ textAlign: "center", marginTop: spacingY._15 }}>
            {emptyListMessage}
          </Typo>
        )
      )}

      {loading && (
        <View style={{ top: verticalScale(100) }}>
          <Loading />
        </View>
      )}
    </View>
  );
};

const TransactionItem = ({ item, index, handleClick }: TransactionItemProps) => {
  const category = item?.type === 'income' ? incomeCategory : expenseCategories[item.category!];
  const date = (item?.date as Timestamp)?.toDate()?.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <View>
      <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
        <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
          <FontAwesome6 name={category.icon} size={verticalScale(22)} color={colors.white} weight='fill' />
        </View>
        <View style={styles.categoryDes}>
          <Typo size={17}>{category.label}</Typo>
          <Typo size={12} color={colors.neutral400} textProps={{ numberOfLines: 1 }}>
            {item.description}
          </Typo>
        </View>
        <View style={styles.amountDate}>
          <Typo fontWeight='500' color={item?.type === 'income' ? colors.green : colors.rose}>
            {`${item?.type === 'income' ? "+" : "-"}${item?.amount}`}
          </Typo>
          <Typo size={13} color={colors.neutral400}>{date}</Typo>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    gap: spacingY._17
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,
    backgroundColor: colors.neutral800,
    padding: spacingX._10,
    borderRadius: radius._17
  },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  categoryDes: {
    flex: 1,
    gap: 2.5
  },
  amountDate: {
    alignItems: "flex-end",
    gap: 3
  },
  dateHeading: {
    marginBottom: spacingY._5,
    marginTop: spacingY._10,
    color: colors.text
  }
});