import { colors, spacingY } from '@/constants/theme';
import { ModalWrapperProps } from '@/types';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export default function ModalWrapper({
    style,
    children,
    bg = colors.primaryDark,
}: ModalWrapperProps) {
  return (
    <View style={[styles.container, {backgroundColor: bg}, style && style]}>
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? spacingY._15: 50,
        paddingBottom: Platform.OS === 'ios' ? spacingY._20: spacingY._10,
    }
});
