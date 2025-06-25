import Button from '@/components/Button';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { expenseCategories } from '@/constants/data';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { createOrUpdateTransaction, deleteTransaction } from '@/services/transactionService';
import { TransactionType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    setShowDatePicker(false)
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

  const categoryOptions = [
    { label: 'Income', value: 'Income' },
    // { label: '––– Expenses –––', value: 'heading', disabled: true },
    ...Object.values(expenseCategories)
  ];

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
        {/* <Header 
        title={oldTransaction?.id ? "Edit Transaction" : "Add Transaction"}
        leftIcon={<BackButton />} 
        style={{marginBottom: spacingY._10}}/> */}

        <View style={styles.details}>
          <View style={styles.topSection}>
            {/* Amount display */}
            <View style={styles.amountDisplayContainer}>
              <Typo style={styles.amountDisplayText}>${amountInput}</Typo>
            </View>
            {/* transaction description */}
            <View style={styles.inputContainer}>
              <Input 
                multiline
                placeholder='Description'
                icon={<FontAwesome5 name="file-alt" size={20} color="white" />}
                value={transaction.description}
                onPress={() => {}}
                onChangeText={(value) => 
                  setTransaction({
                    ...transaction,
                    description: value
                  })
                }
              />
            </View>
          </View>
            
          <View style={styles.bottomSection}>
            {/* pill containers */}
            <View style={styles.pillRow}>
              {/* category */}
              <View style={styles.pill}>
                <Dropdown
                  style={styles.dropdownContainer}
                  placeholderStyle={styles.dropdownPlaceholder}
                  selectedTextStyle={styles.dropdownSelectedText}
                  iconStyle={{display: 'none', width: 0, height: 0}}
                  data={categoryOptions}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  itemTextStyle={styles.dropdownItemText}
                  itemContainerStyle={styles.dropdownItemContainer}
                  containerStyle={styles.dropdownListContainer}
                  placeholder={!isFocus ? "Category" : "..."}
                  value={transaction.category}
                  onChange={item => {
                    if (!item.disabled) {
                      setTransaction({ ...transaction, category: item.value });
                    }
                  }}
                  activeColor="transparent"
                  renderLeftIcon={() => (
                    <FontAwesome5
                      style={styles.icon}
                      color={isFocus ? 'blue' : 'black'}
                      name="hand-point-right"
                      size={20}
                    />
                  )}
                />
              </View>

              {/* date */}
              <View style={styles.pill}>
                <Pressable
                  onPress={() => setShowDatePicker(true)}
                  style={{width: '100%', height: '100%', justifyContent: 'center'}}
                >
                  <Typo size={14}>
                    {format(transaction.date as Date, 'MMM d, yyyy')}
                  </Typo>
                </Pressable>
                {showDatePicker && (
                  <View style={styles.datePickerPopover}>
                    <DateTimePicker
                      themeVariant='dark'
                      value={transaction.date as Date}
                      textColor={colors.white}
                      mode='date'
                      display='default'
                      onChange={(event, selectedDate) => {
                        if (event.type === 'set' && selectedDate) {
                          setTransaction({...transaction, date: selectedDate});
                        }
                      }}
                    />
                    <TouchableOpacity
                      style={styles.datePickerDoneButton}
                      onPress={() => setShowDatePicker(false)}
                      activeOpacity={0.8}
                    >
                      <Typo fontWeight={700} color={colors.black}>Done</Typo>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* Numpad */}
            {renderNumpad()}

            {/* footer */}
            <View style={styles.footer}>
              {oldTransaction?.id && !loading && (
                <Button onPress={showDeleteAlert} style={{backgroundColor: colors.rose, paddingHorizontal: spacingX._15}}>
                  <FontAwesome5 name="trash" size={verticalScale(24)} color={colors.white} />
                </Button>
              )
              }

              <Button onPress={onSubmit} style={{ flex: 1}}>
                <Typo color={colors.black} fontWeight={700}>{oldTransaction?.id ? "Update" : "Add"}</Typo>
              </Button>
            </View>
          </View>
        
        {/* DETAILS END */}
        </View>

        
      </View>
    </ModalWrapper>
  );
  
}

const styles = StyleSheet.create({
  details: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start'
  },
  topSection: {
    flexShrink: 0,
  },
  bottomSection: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  scrollContent: {
    paddingBottom: spacingY._15,
  },
  amountDisplayContainer: {
    alignItems: 'center',
    marginVertical: spacingY._20,
  },
  amountDisplayText: {
    fontSize: verticalScale(70),
    color: colors.white,
  },
  numpadContainer: {
    width: '100%',
    height: '55%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacingY._10, // gap between rows
  },
  numpadButton: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.neutral800,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numpadButtonText: {
    fontSize: verticalScale(24),
    color: colors.white,
  },
  pill: {
    position: 'relative',
    backgroundColor: colors.neutral700,
    width: '47%',
    height: verticalScale(40),
    borderWidth: 1,
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous",
    justifyContent: 'center',
    overflow: 'visible'
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(10)
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',  
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    marginBottom: spacingY._10,
  },
  datePickerButton: {
    backgroundColor: colors.neutral700,
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10
  },
  datePickerPopover: {
    position: 'absolute',
    top: verticalScale(40),
    zIndex: 999,
    padding: spacingY._10,
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    width: 250,
  },
  datePickerCard: {
    backgroundColor: colors.neutral800,
    borderRadius: radius._15,
    padding: spacingY._15,
    marginTop: spacingY._7,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    width: '95%',
    alignItems: 'center',
  },
  datePickerDoneButton: {
    marginTop: spacingY._10,
    backgroundColor: colors.neutral300,
    borderRadius: radius._10,
    paddingVertical: spacingY._7,
    paddingHorizontal: spacingX._20,
    alignSelf: 'center',
  },
  dropdownContainer: {
    width: '80%',
    left: -scale(2),
  },
  dropdownItemText: {
    color: colors.neutral200,
  },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14)
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._20,
    borderCurve: "continuous",
    paddingVertical: spacingY._12,
    top: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 6,
    width: '80%',
    left: scale(30),
  },
  dropdownPlaceholder: {
    color: colors.white
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._12,
    marginVertical: spacingY._5,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral700,
    backgroundColor: 'transparent',
  },
  dropdownIcon: {
    height: verticalScale(30),
    tintColor: colors.neutral300,
    right: -20
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
    borderColor: colors.neutral800,
    borderRadius: radius._15,
    paddingHorizontal: spacingX._15,
    paddingVertical: spacingY._10,
    height: verticalScale(100),
    justifyContent: 'flex-start',
  },
  descriptionInput: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  icon: {
    marginRight: 5,
    color: colors.white
  }
});
