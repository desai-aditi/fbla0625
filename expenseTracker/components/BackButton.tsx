import { colors, radius, spacingY } from '@/constants/theme';
import { BackButtonProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

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
        marginTop: spacingY._7,
        backgroundColor: colors.primaryLight,
        alignSelf: 'flex-start',
        borderRadius: radius._12,
        borderCurve: 'continuous',
        padding: 5
    }
});
