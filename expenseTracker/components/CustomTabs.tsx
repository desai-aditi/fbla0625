import { colors, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import Entypo from '@expo/vector-icons/Entypo';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {

  const tabbarIcons: any = {
    index: (isFocused: boolean) => (
      <Entypo name="home" size={verticalScale(26)} color={isFocused? colors.primary : colors.neutral400}/>
    ),
    ledger: (isFocused: boolean) => (
      <Entypo name="list" size={verticalScale(26)} color={isFocused? colors.primary : colors.neutral400}/>
    ),
    add: (isFocused: boolean) => (
      <Entypo name="plus" size={verticalScale(26)} color={isFocused? colors.primary : colors.neutral400}/>
    ),
    chat: (isFocused: boolean) => (
      <Entypo name="chat" size={verticalScale(26)} color={isFocused? colors.primary : colors.neutral400}/>
    ),
    profile: (isFocused: boolean) => (
      <Entypo name="user" size={verticalScale(26)} color={isFocused? colors.primary : colors.neutral400}/>
    ),
  }

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            // href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItem}
          >
            {
              tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)
            }
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    tabbar: {
        flexDirection: 'row',
        width: '100%',
        height: Platform.OS === 'ios'? verticalScale(65): verticalScale(45),
        backgroundColor: colors.neutral800,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopColor: colors.neutral700,
        borderTopWidth: 1
    },
    tabbarItem: {
        marginBottom: Platform.OS === 'ios' ? spacingY._10: spacingY._5,
        justifyContent: 'center',
        alignItems: 'center',
    }
})