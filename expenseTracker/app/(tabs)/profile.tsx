import Header from '@/components/Header';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { auth } from '@/config/firebase';
import { colors, radius, shadows, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { getProfileImage } from '@/services/imageServices';
import { fetchTotals } from '@/services/transactionService';
import { accountOptionType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();

  const [savingsRate, setSavingsRate] = useState<number | undefined>();
  const [transactionCount, setTransactionCount] = useState<number | undefined>();
  const [categoryCount, setCategoryCount] = useState<number | undefined>();

  useEffect(() => {
      if (user?.uid) {
        fetchTotals(user.uid).then((response) => {
          if (response.success) {
            const {totals, totalTransactions, totalCategories} = response.data;

            const savings = totals?.income - totals?.expenses;
            const rate = totals?.income > 0 ? (savings / totals?.income) * 100 : 0;
            setSavingsRate(rate);
            setTransactionCount(totalTransactions);
            setCategoryCount(totalCategories);

          }
        });
      }
    }, [user?.uid]);

  const accountOptions: accountOptionType[] = [
    {
      title: 'Edit profile',
      icon: (
        <Feather name="edit-3" size={20} color={colors.white} />
      ),
      routeName: '/(modals)/profileModal',
      bgColor: colors.primary,
      description: 'Update your personal information'
    },
    {
      title: 'Logout',
      icon: (
        <Feather name="log-out" size={20} color={colors.white} />
      ),
      bgColor: colors.error,
      description: 'Sign out of your account'
    },
  ];

  const handleLogout = async () => {
    await signOut(auth);
  }

  const showLogoutAlert = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
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

  const handlePress = (item: accountOptionType) => {
    if (item.title === 'Logout') {
      showLogoutAlert();
      return;
    } 

    if (item.routeName) router.push(item.routeName);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title='Profile' style={styles.header}/>

        {/* Profile Card */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.profileCard}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.profileGradient}
          >
            {/* Avatar Container */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatarWrapper}>
                <Image style={styles.avatar} source={getProfileImage(user?.image)} />
                <View style={styles.avatarBorder} />
              </View>
              <View style={styles.onlineIndicator} />
            </View>

            {/* User Info */}
            <View style={styles.userInfo}>
              <Typo size={24} fontWeight={700} color={colors.white} style={styles.userName}>
                {user?.name}
              </Typo>
              <Typo size={15} fontWeight={500} color={colors.neutral200} style={styles.userEmail}>
                {user?.email}
              </Typo>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Typo size={20} fontWeight={700} color={colors.white}>{transactionCount}</Typo>
                <Typo size={12} fontWeight={500} color={colors.neutral200}>Transactions</Typo>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Typo size={20} fontWeight={700} color={colors.white}>{categoryCount}</Typo>
                <Typo size={12} fontWeight={500} color={colors.neutral200}>Categories</Typo>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Typo size={20} fontWeight={700} color={colors.white}>{savingsRate?.toFixed(1)}%</Typo>
                <Typo size={12} fontWeight={500} color={colors.neutral200}>Savings Rate</Typo>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Account Options */}
        <View style={styles.optionsContainer}>
          <Typo size={18} fontWeight={600} color={colors.text} style={styles.sectionTitle}>
            Account Settings
          </Typo>
          
          <View style={styles.optionsList}>
            {accountOptions.map((item, index) => (
              <Animated.View 
                key={index.toString()} 
                entering={FadeInDown.delay(200 + index * 100).springify().damping(14)}
              >
                <TouchableOpacity 
                  style={styles.optionItem} 
                  onPress={() => handlePress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <View style={[styles.optionIcon, { backgroundColor: item.bgColor }]}>
                      {item.icon && item.icon}
                    </View>
                    
                    <View style={styles.optionText}>
                      <Typo size={16} fontWeight={600} color={colors.text}>
                        {item.title}
                      </Typo>
                      {item.description && (
                        <Typo size={13} fontWeight={400} color={colors.textMuted}>
                          {item.description}
                        </Typo>
                      )}
                    </View>
                    
                    <View style={styles.optionArrow}>
                      <Feather 
                        name="chevron-right" 
                        size={20} 
                        color={colors.textMuted} 
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginVertical: spacingY._20,
  },
  profileCard: {
    marginTop: spacingY._10,
    borderRadius: radius._20,
    overflow: 'hidden',
    ...shadows.medium,
  },
  profileGradient: {
    padding: spacingX._24,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacingY._16,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: verticalScale(100),
    height: verticalScale(100),
    borderRadius: verticalScale(50),
    backgroundColor: colors.neutral600,
  },
  avatarBorder: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: verticalScale(53),
    borderWidth: 3,
    borderColor: colors.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.white,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: spacingY._20,
  },
  userName: {
    marginBottom: spacingY._5,
    textAlign: 'center',
  },
  userEmail: {
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: spacingY._16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: verticalScale(30),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  optionsContainer: {
    marginTop: spacingY._30,
    flex: 1,
    
  },
  sectionTitle: {
    marginBottom: spacingY._16,
    paddingLeft: spacingX._5,
  },
  optionsList: {
    backgroundColor: colors.cardBg,
    borderRadius: radius._16,
    borderWidth: 1,
    borderColor: colors.neutral200,
    overflow: 'hidden',
    ...shadows.small,
  },
  optionItem: {
    backgroundColor: colors.cardBg,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacingX._16,
    paddingVertical: spacingY._16,
  },
  optionIcon: {
    width: verticalScale(40),
    height: verticalScale(40),
    borderRadius: radius._12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacingX._12,
  },
  optionText: {
    flex: 1,
    gap: spacingY._3,
  },
  optionArrow: {
    marginLeft: spacingX._8,
  },
});