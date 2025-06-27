import { colors, spacingX, spacingY } from '@/constants/theme';
import { ScreenWrapperProps } from '@/types';
import React from 'react';
import { Dimensions, Platform, StatusBar, View } from 'react-native';

const {height} = Dimensions.get('window');

export default function ScreenWrapper({style, barStyle='dark-content', children}: ScreenWrapperProps) {
    let paddingTop = Platform.OS === 'ios' ? height * 0.06 : 50;
  return (
    <View style={[{
        paddingTop,
        paddingVertical: spacingY._20,
        paddingHorizontal: spacingX._20,
        flex: 1,
        backgroundColor: colors.bg,
    }, style]}>
      <StatusBar barStyle={barStyle}/>
      {children}
    </View>
  );
}