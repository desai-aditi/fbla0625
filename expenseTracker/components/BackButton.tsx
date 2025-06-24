import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { BackButtonProps } from '@/types';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';import { verticalScale } from '@/utils/styling';
import { colors, radius } from '@/constants/theme';

export default function BackButton({
    style,
    iconSize = 22,
}: BackButtonProps) {
    const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()} style={[styles.button, style]}>
        <AntDesign
            name = "left"
            size={verticalScale(iconSize)}
            color={colors.white}
        />
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.neutral600,
        alignSelf: 'flex-start',
        borderRadius: radius._12,
        borderCurve: 'continuous',
        padding: 5
    }
});
