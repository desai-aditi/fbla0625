import { firestore } from "@/config/firebase";
import { colors } from "@/constants/theme";
import { ResponseType, TransactionType } from "@/types";
import { getLast12Months, getLast7Days, getYearsRange } from "@/utils/common";
import { scale } from "@/utils/styling";
import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc, Timestamp, where } from "firebase/firestore";

export const createOrUpdateTransaction = async (
    transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
    try {
        const {id, type, amount} = transactionData;
        if(!amount || amount<=0 || !type){
            return {success: false, msg: "invalid transaction data!"};
        }
        // create transaction 
        const transactionRef = id? doc(firestore, "transactions", id) : doc(collection(firestore, "transactions"));

        await setDoc(transactionRef, transactionData, {merge: true});


        return { success: true, data: {...transactionData, id: transactionRef.id}};
    } catch (err: any) {
        console.log('error', err)
        return { success: false, msg: err.message }
    }
};

export const deleteTransaction = async (
    id: string,
) => {
    try {
        const transactionRef = doc(firestore, "transactions", id);

        await deleteDoc(transactionRef);

        return { success: true, data: {id: transactionRef.id}};
    } catch (err: any) {
        console.log('error', err)
        return { success: false, msg: err.message }
    }
}

export const fetchWeeklyStats = async (
    uid: string,
): Promise<ResponseType> => {
    try {
        const db = firestore;
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const transationsQuery = query(
            collection(db, "transactions"),
            where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
            where("date", "<=", Timestamp.fromDate(today)),
            orderBy("date", "desc"),
            where("uid", "==", uid)
        );

        const querySnapshot = await getDocs(transationsQuery);
        const weeklyData = getLast7Days();
        const transactions: TransactionType[] = [];

        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);

            const transactionDate =(transaction.date as Timestamp).toDate().toISOString().split('T')[0];
            const dayData = weeklyData.find((day) => day.date === transactionDate);

            if(dayData){
                if(transaction.type === "income"){
                    dayData.income += transaction.amount || 0;
                } else if(transaction.type === "expense"){
                    dayData.expense += transaction.amount || 0;
                }
            }
        });

        const stats = weeklyData.flatMap((day) => [
            {
                value: day.income,
                label: day.day,
                spacing: scale(4),
                labelWidth: scale(30),
                frontColor: colors.primary
            },
            {value: day.expense, frontColor: colors.rose},
        ]);

        return {
            success: true,
            data: {
                stats,
                transactions,
            },
        };
    } catch (err: any) {
        console.log('error', err)
        return { success: false, msg: err.message }
    }
}
export const fetchMonthlyStats = async (
    uid: string,
): Promise<ResponseType> => {
    try {
        const db = firestore;
        const today = new Date();
        const twelveMonthsAgo = new Date(today);
        twelveMonthsAgo.setMonth(today.getMonth() - 12);

        const transationsQuery = query(
            collection(db, "transactions"),
            where("date", ">=", Timestamp.fromDate(twelveMonthsAgo)),
            where("date", "<=", Timestamp.fromDate(today)),
            orderBy("date", "desc"),
            where("uid", "==", uid)
        );

        const querySnapshot = await getDocs(transationsQuery);
        const monthlyData = getLast12Months();
        const transactions: TransactionType[] = [];

        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);

            const transactionDate =(transaction.date as Timestamp).toDate();
            const monthName = transactionDate.toLocaleString('default', { month: 'short' });
            const shortYear = transactionDate.getFullYear().toString().slice(-2);
            const monthData = monthlyData.find(
                (month) => month.month === `${monthName} ${shortYear}`
            );

            if(monthData){
                if(transaction.type === "income"){
                    monthData.income += transaction.amount || 0;
                } else if(transaction.type === "expense"){
                    monthData.expense += transaction.amount || 0;
                }
            }
        });

        const stats = monthlyData.flatMap((month) => [
            {
                value: month.income,
                label: month.month,
                spacing: scale(4),
                labelWidth: scale(30),
                frontColor: colors.primary
            },
            {value: month.expense, frontColor: colors.rose},
        ]);

        return {
            success: true,
            data: {
                stats,
                transactions,
            },
        };
    } catch (err: any) {
        console.log('error', err)
        return { success: false, msg: err.message }
    }
}
export const fetchYearlyStats = async (
    uid: string,
): Promise<ResponseType> => {
    try {
        const db = firestore;

        const transationsQuery = query(
            collection(db, "transactions"),
            orderBy("date", "desc"),
            where("uid", "==", uid)
        );

        const querySnapshot = await getDocs(transationsQuery);
        const transactions: TransactionType[] = [];

        const firstTransaction = querySnapshot.docs.reduce((earliest, doc) => {
            const transactionDate = doc.data().date.toDate();
            return transactionDate < earliest ? transactionDate: earliest;
        }, new Date());

        const firstYear = firstTransaction.getFullYear();
        const currentYear = new Date().getFullYear();

        const yearlyData = getYearsRange(firstYear, currentYear);

        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);

            const transactionYear =(transaction.date as Timestamp).toDate().getFullYear();
            
            const yearData = yearlyData.find(
                (item: any) => item.year === transactionYear.toString()
            );

            if(yearData){
                if(transaction.type === "income"){
                    yearData.income += transaction.amount;
                } else if(transaction.type === "expense"){
                    yearData.expense += transaction.amount;
                }
            }
        });

        const stats = yearlyData.flatMap((year: any) => [
            {
                value: year.income,
                label: year.year,
                spacing: scale(4),
                labelWidth: scale(35),
                frontColor: colors.primary
            },
            {value: year.expense, frontColor: colors.rose},
        ]);

        return {
            success: true,
            data: {
                stats,
                transactions,
            },
        };
    } catch (err: any) {
        console.log('error', err)
        return { success: false, msg: err.message }
    }
}