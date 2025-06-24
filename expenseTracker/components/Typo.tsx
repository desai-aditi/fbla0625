import { Text, TextStyle } from 'react-native';
import React  from 'react';
import { colors } from '@/constants/theme';
import { TypoProps } from '@/types';
import { verticalScale } from '@/utils/styling';

export default function Typo({
    size,
    color = colors.text,
    fontWeight = "normal",
    children,
    style,
    textProps = {},
}: TypoProps) {

    const textStyle: TextStyle = {
        fontSize: size ? verticalScale(size) : verticalScale(18),
        color,
        fontWeight,
    };

  return <Text style={[textStyle, style]} {...textProps}>{children}</Text>;
}