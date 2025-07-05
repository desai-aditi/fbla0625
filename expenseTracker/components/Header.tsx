import Typo from '@/components/Typo';
import { colors } from '@/constants/theme';
import { HeaderProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Header({title="", leftIcon, style}: HeaderProps) {
  return (
    <View style={[styles.container, style]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        {
            title && (
                <Typo size={verticalScale(22)} fontWeight={600} style={{
                    textAlign: 'center',
                    width: leftIcon ? '80%' : '100%',
                    color: colors.textLight
                }}>{title}</Typo>
            )
        }
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    leftIcon: {
        alignSelf: 'flex-start',
    }
});
