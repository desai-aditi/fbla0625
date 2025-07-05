import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { getProfileImage } from '@/services/imageServices';
import { updateUser } from '@/services/userService';
import { UserDataType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import Feather from '@expo/vector-icons/Feather';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ProfileModal() {
  const { user, updateUserData } = useAuth();
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUserData({
      name: user?.name || "",
      image: user?.image || null,
    })
  }, [user])

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUserData({...userData, image: result.assets[0]});
    }

  }

  const onSubmit = async () => {
    let {name, image} = userData;

    if (!name.trim()) {
      Alert.alert("user", "Please fill in all the fields");
      return;
    }
    
    setLoading(true);
    const res = await updateUser(user?.uid as string, userData);
    setLoading(false);

    if (res.success){
      updateUserData(user?.uid as string);
      router.back();
    } else {
      Alert.alert("user", res.msg);
    }
  };

  return (
    <ModalWrapper>
      <View style={styles.container}>
        <Header title='Update Profile' leftIcon={<BackButton />} style={{marginBottom: spacingY._10}}/>
      
        <ScrollView contentContainerStyle={styles.form}>
          <View style={styles.avatarContainer}>
            <Image 
              style={styles.avatar}
              source={getProfileImage(userData.image)}
              contentFit='cover'
              transition={100}
            />
            <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
              <Feather name="edit-3" size={verticalScale(20)} color={colors.neutral800}></Feather>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
              <Typo fontWeight={'bold'} color={colors.textLight}>Name</Typo>
              <Input 
                placeholder="Name"
                value={userData.name}
                onChangeText={(value) => {setUserData({...userData, name: value})}}
              />
            </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button onPress={onSubmit} style={{ flex: 1, backgroundColor: colors.white}}>
            <Typo color={colors.text} fontWeight={700}>Update</Typo>
          </Button>
        </View>
      </View>
    </ModalWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20
  },
  form: {
    gap: spacingY._20,
    marginTop: spacingY._15
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',  
    alignItems: 'center',
    paddingHorizontal: spacingX._20,
    gap: scale(12),
    paddingTop: spacingY._15,
    marginBottom: spacingY._30,
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
    position: "absolute",
    bottom: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7
  },
  inputContainer: {
    gap: spacingY._10,
    flex: 1,
  }
});
