import ScreenWrapper from '@/components/ScreenWrapper';
import { colors, spacingX } from '@/constants/theme';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { BarChart, barDataItem } from 'react-native-gifted-charts';

enum Period {
  week = 'week',
  month = 'month',
  year = 'year',
}

export default function SummaryChart() {
  const [chartData, setChartData] = useState<barDataItem[]>([]);
  const [chartPeriod, setChartPeriod] = useState<Period>(Period.week);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentEndDate, setCurrentEndDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchData = async () => {
      if (chartPeriod === Period.week){

      }
    }
  }, [])

  const getWeekRange = (date: Date) => {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    const endOfWeek = new Date(date.setDate(startOfWeek.getDate() + 6));

    return { startDate: Math.floor(startOfWeek.getTime()), endDate: Math.floor(endOfWeek.getTime()) };
  }

  return (
    <ScreenWrapper style={{backgroundColor: colors.neutral100, paddingHorizontal: spacingX._20}}>
      <View style={styles.card}>
        <BarChart />
      </View>
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: colors.white,
    padding: spacingX._20,
    boxShadow: "0px 4px 6px rgba(0, 0, 1, 0.05)",
    },
});