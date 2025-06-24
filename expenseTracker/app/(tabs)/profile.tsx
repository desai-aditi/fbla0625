import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { auth } from '@/config/firebase';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { getProfileImage } from '@/services/imageServices';
import { accountOptionType } from '@/types';
import { verticalScale } from '@/utils/styling';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();

  const accountOptions: accountOptionType[] = [
    {
      title: 'Edit profile',
      icon: (
        <Feather name="edit-3" size={24} color={colors.white} />
      ),
      routeName: '/(modals)/profileModal',
      bgColor: '#6366f1'
    },
    {
      title: 'Settings',
      icon: (
        <Feather name="settings" size={24} color={colors.white} />
      ),
      // routeName: '/(modals)/profileModal',
      bgColor: '#059669'
    },
    {
      title: 'Privacy Policy',
      icon: (
        <Feather name="lock" size={24} color={colors.white} />
      ),
      // routeName: '/(modals)/profileModal',
      bgColor: colors.neutral400
    },
    {
      title: 'Logout',
      icon: (
        <Feather name="log-out" size={24} color={colors.white} />
      ),
      // routeName: '/(modals)/profileModal',
      bgColor: '#e11d48'
    },
  ];

  const handleLogout = async () => {
    await signOut(auth);
  }

  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?" , [
      {
        text: 'Cancel',
        onPress: () => console.log('cancel logout'),
        style: 'cancel'
      },
      {
        text: 'Logout',
        onPress: () => handleLogout(),
        style: 'destructive'
      }
    ])
  }

  const handlePress = (item:accountOptionType) => {
    if (item.title === 'Logout') {
      showLogoutAlert();
    } 

    if (item.routeName) router.push(item.routeName);
  };
  

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title='Profile' style={{marginVertical: spacingY._10}}/>

        <View style={styles.userInfo}>
          {/* avatar */}
          <View>
            <Image style={styles.avatar} source={getProfileImage(user?.image)} />
          </View>

          {/* name and email */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={600} color={colors.neutral100}>{user?.name}</Typo>
            <Typo size={15} fontWeight={600} color={colors.neutral400}>{user?.email}</Typo>
          </View>
        </View>

        {/* account options */}
        <View style={styles.accountOptions}>
          {
            accountOptions.map((item, index) => {
              return (
                 
                <Animated.View key={index.toString()} entering={FadeInDown.delay(index*50).springify().damping(14)} style={styles.listItem}>
                  <TouchableOpacity style={styles.flexRow} onPress={() => handlePress(item)}>
                    <View style={[styles.listIcon,
                    {
                      backgroundColor: item?.bgColor
                    }]}>
                      {item.icon && item.icon}
                    </View>
                    <Typo size={16} fontWeight={500} style={{flex: 1}}>{item.title}</Typo>
                    <Feather name="arrow-right" size={30} color={colors.white} />
                  </TouchableOpacity>
                </Animated.View>
              );
            })
          }
        </View>
      </View>
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: 'center',
    gap: spacingY._15,
  }, 
  avatarContainer: {
    position: 'relative',
    alignSelf: "center",
  },
  avatar: {
    width: verticalScale(120),
    height: verticalScale(120),
    alignSelf: 'center',
    backgroundColor: colors.neutral900,
    borderRadius: '50%',
  }, 
  editIcon: {
    position: 'absolute',
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: 'center',
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius._15,
    borderCurve: 'continuous'
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOptions: {
    marginTop: spacingY._35
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._10,
  }
});
