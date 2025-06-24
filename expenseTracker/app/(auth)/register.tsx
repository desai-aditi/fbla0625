import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { verticalScale } from '@/utils/styling';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

export default function Register() {
    const nameRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false); 
    const router = useRouter();
    const { register: registerUser } = useAuth();
    
    const handleSubmit = async () => {
        if(!emailRef.current || !passwordRef.current || !nameRef.current) {
            Alert.alert('Sign Up', 'Please fill in all fields.');
            return;
        }
        
        setIsLoading(true);
        const res = await registerUser(emailRef.current, passwordRef.current, nameRef.current);
        
        setIsLoading(false);
        if(!res.success) {
            Alert.alert('Sign Up', res.msg);
        }

    };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton />

        <View style={{gap: 5, marginTop: spacingY._20}}>
            <Typo size={30} fontWeight={"800"}>Let's</Typo>
            <Typo size={30} fontWeight={"800"}>Get Started!</Typo>
        </View>

        <View style={styles.form}>
            <Typo size={16} color={colors.textLighter}>Create an account</Typo>
            <Input 
                onChangeText={(value) => (nameRef.current = value)} 
                placeholder='Enter your name' 
                icon={<Feather name="at-sign" size={verticalScale(14)} color={colors.neutral300} />}>
            </Input>
            <Input 
                onChangeText={(value) => (emailRef.current = value)} 
                placeholder='Enter your email' 
                icon={<Feather name="at-sign" size={verticalScale(14)} color={colors.neutral300} />}>
            </Input>
            <Input 
                onChangeText={(value) => (passwordRef.current = value)}
                secureTextEntry 
                placeholder='Enter your password' 
                icon={<Feather name="lock" size={verticalScale(14)} color={colors.neutral300} />}>
            </Input>

            <Button loading={isLoading} onPress={() => handleSubmit()}>
                <Typo size={16} fontWeight={"600"} color={colors.black}>Sign Up</Typo>
            </Button>
        </View>

        <View style={styles.footer}>
            <Typo style={styles.forgotPassword} size={14}>Already have an account?</Typo>
            
            <Pressable onPress={() => router.push('/(auth)/login')}>
                <Typo size={15} fontWeight={"700"} color={colors.primary}>Login</Typo>
            </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20,
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: 'bold',
        color: colors.text
    },
    form: {
        gap: spacingY._20
    },
    forgotPassword: {
        textAlign: 'right',
        fontWeight: '500',
        color: colors.text
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',  
        alignItems: 'center',
        gap: 5
    },
    footerText: {
        textAlign: 'center',
        fontWeight: '500',
        fontSize: verticalScale(15),
    }
});