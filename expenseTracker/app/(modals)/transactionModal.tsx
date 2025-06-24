import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { expenseCategories, transactionTypes } from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { createOrUpdateTransaction, deleteTransaction } from '@/services/transactionService';
import { TransactionType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export default function TransactionModal() {
  const { user, updateUserData } = useAuth();
  const [transaction, setTransaction] = useState<TransactionType>({
    type: 'expense',
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    image: null
  });

  const [amountInput, setAmountInput] = useState("0");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();


  type paramType = {
    id?: string;
    type?: string;
    amount?: string;
    category?: string;
    date?: string;
    description?: string;
    uid?: string;
  }
  const oldTransaction = useLocalSearchParams() as paramType;

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction?.amount),
        description: oldTransaction?.description || "",
        id: oldTransaction?.id,
        category: oldTransaction?.category || "",
        date: new Date(oldTransaction.date),
        uid: oldTransaction?.uid
      });
      setAmountInput(oldTransaction?.amount || "0");
    } else if (oldTransaction?.date) {
      setTransaction(prev => ({
        ...prev,
        type: oldTransaction.type as 'income' | 'expense',
        date: new Date(oldTransaction.date),
      }));
      setAmountInput("0");
    }
  }, []);

  const onDateChange = (event: DateTimePickerEvent, selectedDate: Date) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({...transaction, date: currentDate});
  }

  const onSubmit = async () => {
    const {type, description, category, date} = transaction;
    const amount = Number(amountInput);

    if(type === 'expense' ? !date || amount <= 0 || !category : !date || amount <= 0) {
      Alert.alert("Transaction", "Please fill in all the fields");
      return;
    }

    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      uid: user?.uid
    }

    // if update transaction
    if(oldTransaction?.id) transactionData.id = oldTransaction.id;

    // create/update transaction
    setLoading(true);
    const res = await createOrUpdateTransaction(transactionData);

    setLoading(false);
    if(res.success){
      router.back();
    } else {
      Alert.alert("Transaction", res.msg);
    }
  }

  const onDelete = async () => {
    if(!oldTransaction?.id) return;

    const res = await deleteTransaction(oldTransaction?.id);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert("Transaction", res.msg)
    }
  }

  const showDeleteAlert = () => {
    Alert.alert("Transaction", "Are you sure you want to delete this transaction?", [
      {
        text: "Cancel",
        onPress: () => console.log("cancel delete"),
        style: "cancel"
      },
      {
        text: "Delete",
        onPress: () => onDelete(),
        style: "destructive"
      }
    ])
  }

  const [isFocus, setIsFocus] = useState(false);

  const handleNumpadPress = (value: string) => {
    if (value === 'backspace') {
      if (amountInput.length === 1) {
        setAmountInput("0");
      } else {
        setAmountInput(amountInput.slice(0, -1));
      }
    } else if (value === '.') {
      if (!amountInput.includes('.')) {
        setAmountInput(amountInput + '.');
      }
    } else {
      if (amountInput === "0") {
        setAmountInput(value);
      } else {
        setAmountInput(amountInput + value);
      }
    }
  };

  const renderNumpad = () => {
    const buttons = [
      '1','2','3',
      '4','5','6',
      '7','8','9',
      '.', '0', 'backspace'
    ];

    return (
      <View style={styles.numpadContainer}>
        {buttons.map((btn) => (
          <TouchableOpacity
            key={btn}
            style={styles.numpadButton}
            onPress={() => handleNumpadPress(btn)}
            activeOpacity={0.7}
          >
            {btn === 'backspace' ? (
              <FontAwesome5 name="backspace" size={verticalScale(24)} color={colors.white} />
            ) : (
              <Text style={styles.numpadButtonText}>{btn}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
   <ModalWrapper>
      <View style={styles.container}>
        <Header 
        title={oldTransaction?.id ? "Edit Transaction" : "Add Transaction"}
        leftIcon={<BackButton />} 
        style={{marginBottom: spacingY._10}}/>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>

          {/* Amount display */}
          <View style={styles.amountDisplayContainer}>
            <Typo style={styles.amountDisplayText} fontWeight={700}>${amountInput}</Typo>
          </View>

          {/* Numpad */}
          {renderNumpad()}

          {/* type */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Type</Typo>
            
            <Dropdown
              style={styles.dropdownContainer}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownSelectedText}
              iconStyle={styles.dropdownIcon}
              data={transactionTypes}
              maxHeight={300}
              labelField="label"
              valueField="value"
              itemTextStyle={styles.dropdownItemText}
              itemContainerStyle={styles.dropdownItemContainer}
              containerStyle={styles.dropdownListContainer}
              placeholder={!isFocus ? "Select item" : "..."}
              value={transaction.type}
              onChange={item => {
                setTransaction({...transaction, type: item.value})
              }}
            />
          </View>

          {/* category */}
          {
            transaction.type === 'expense' && (
              <View style={styles.inputContainer}>
                <Typo color={colors.neutral200}>Expense Category</Typo>
                
                <Dropdown
                  style={styles.dropdownContainer}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  iconStyle={styles.dropdownIcon}
                  data={Object.values(expenseCategories)}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  itemTextStyle={styles.dropdownItemText}
                  itemContainerStyle={styles.dropdownItemContainer}
                  containerStyle={styles.dropdownListContainer}
                  placeholder={!isFocus ? "Select category" : "..."}
                  value={transaction.category}
                  onChange={item => {
                    setTransaction({...transaction, category: item.value})
                  }}
                />
              </View>
            )
          }

          {/* date */}
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Date</Typo>
            {
              !showDatePicker && (
                <Pressable
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Typo size={14}>
                    {(transaction.date as Date).toLocaleDateString()}
                  </Typo>
                </Pressable>
              )
            }

            {
              showDatePicker && (
                <View>
                  <DateTimePicker
                    themeVariant='dark'
                    value={transaction.date as Date}
                    textColor={colors.white}
                    mode='date'
                    display='spinner'
                    onChange={onDateChange}
                  />

                  {
                    Platform.OS === 'ios' && (
                      <TouchableOpacity
                        style = {styles.datePickerButton}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Typo size={15} fontWeight={"500"}>Ok</Typo>
                      </TouchableOpacity>
                    )
                  }
                </View>
              )
            }
          </View>

          {/* transaction description */}
          <View style={styles.inputContainer}>
            <View style={styles.flexRow}>
              <Typo color={colors.neutral200}>Description</Typo>
              <Typo color={colors.neutral500} >(optional)</Typo>
            </View>

            <View style={styles.descriptionInputContainer}>
              <Typo 
                style={styles.descriptionInput}
                multiline
                onPress={() => {}}
                onChangeText={(value) => 
                  setTransaction({
                    ...transaction,
                    description: value
                  })
                }
              >
                {transaction.description}
              </Typo>
            </View>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          {oldTransaction?.id && !loading && (
            <Button onPress={showDeleteAlert} style={{backgroundColor: colors.rose, paddingHorizontal: spacingX._15}}>
              <FontAwesome5 name="trash-can" size={verticalScale(24)} color={colors.white} />
            </Button>
          )
          }

          <Button onPress={onSubmit} style={{ flex: 1}}>
            <Typo color={colors.black} fontWeight={700}>{oldTransaction?.id ? "Update" : "Add"}</Typo>
          </Button>
        </View>
      </View>
    </ModalWrapper>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
    justifyContent: 'space-between',
  },
  scrollContent: {
    paddingBottom: spacingY._15,
  },
  amountDisplayContainer: {
    alignItems: 'center',
    marginVertical: spacingY._20,
  },
  amountDisplayText: {
    fontSize: verticalScale(48),
    color: colors.white,
    fontWeight: '700',
  },
  numpadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacingY._20,
    paddingHorizontal: spacingX._10,
  },
  numpadButton: {
    width: '30%',
    aspectRatio: 1,
    marginVertical: spacingY._7,
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numpadButtonText: {
    fontSize: verticalScale(28),
    color: colors.white,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',  
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10
  },
  dropdownContainer: {
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous"
  },
  dropdownItemText: { color: colors.white },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14)
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5
  },
  dropdownPlaceholder: {
    color: colors.white
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300
  },
  dateInput: {
    height: verticalScale(50),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
    justifyContent: "center"
  },
  inputContainer: {
    gap: spacingY._10,
    flex: 1,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5
  },
  descriptionInputContainer: {
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._15,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._10,
    height: verticalScale(100),
    justifyContent: 'flex-start',
  },
  descriptionInput: {
    color: colors.white,
    fontSize: verticalScale(14),
  }
});
