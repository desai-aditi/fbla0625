import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ScreenWrapper from '@/components/ScreenWrapper';
import Typo from '@/components/Typo';
import { colors, radius, shadows, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import { verticalScale } from '@/utils/styling';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

export default function Login() {
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const [isLoading, setIsLoading] = useState(false); 
    const router = useRouter();
    const {login: loginUser} = useAuth();
    
    const handleSubmit = async () => {
        if(!emailRef.current || !passwordRef.current) {
            Alert.alert('Login', 'Please fill in all fields.');
            return;
        }
        setIsLoading(true);
        const res = await loginUser(emailRef.current, passwordRef.current);
        setIsLoading(false);
        if(!res.success) {
            Alert.alert('Login', res.msg);
        }
    };

  return (
    <ScreenWrapper style={{ backgroundColor: colors.bg }}>
      <View style={styles.container}>
        <BackButton />

        <View style={styles.headerContainer}>
            <Typo size={32} fontWeight={"800"} color={colors.text}>Hey,</Typo>
            <Typo size={32} fontWeight={"800"} color={colors.primary}>Welcome back!</Typo>
        </View>

        <View style={styles.formCard}>
            <View style={styles.form}>
                <Typo size={16} color={colors.textSecondary} style={styles.subtitle}>
                    Login to your account
                </Typo>
                <Input 
                    onChangeText={(value) => (emailRef.current = value)} 
                    placeholder='Enter your email' 
                    icon={<Feather name="mail" size={verticalScale(16)} color={colors.primary} />}
                    style={styles.input}
                />
                <Input 
                    onChangeText={(value) => (passwordRef.current = value)}
                    secureTextEntry 
                    placeholder='Enter your password' 
                    icon={<Feather name="lock" size={verticalScale(16)} color={colors.primary} />}
                    style={styles.input}
                />

                <Pressable style={styles.forgotPasswordContainer}>
                    <Typo style={styles.forgotPassword} size={14} color={colors.primary}>
                        Forgot Password?
                    </Typo>
                </Pressable>

                <Button 
                    loading={isLoading} 
                    onPress={() => handleSubmit()}
                    style={styles.loginButton}
                >
                    <Typo size={16} fontWeight={"700"} color={colors.white}>Login</Typo>
                </Button>
            </View>
        </View>

        <View style={styles.footer}>
            <Typo size={14} color={colors.textMuted}>Don't have an account?</Typo>
            
            <Pressable onPress={() => router.push('/(auth)/register')} style={styles.signUpButton}>
                <Typo size={15} fontWeight={"700"} color={colors.primary}>Sign up</Typo>
            </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    headerContainer: {
        gap: 5, 
        marginTop: spacingY._30,
        marginBottom: spacingY._40,
    },
    subtitle: {
        marginBottom: spacingY._10,
    },
    formCard: {
        backgroundColor: colors.cardBg,
        borderRadius: radius._20,
        padding: spacingX._25,
        ...shadows.medium,
        borderWidth: 1,
        borderColor: colors.neutral200,
    },
    form: {
        gap: spacingY._15,
    },
    input: {
        borderColor: colors.neutral300,
        flex: 1
    },
    forgotPasswordContainer: {
        alignSelf: 'flex-end',
    },
    forgotPassword: {
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: colors.primary,
        borderRadius: radius._12,
        marginTop: spacingY._5,
        ...shadows.medium,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',  
        alignItems: 'center',
        gap: 8,
        marginTop: spacingY._40,
        paddingVertical: spacingY._20,
    },
    signUpButton: {
        paddingVertical: spacingY._5,
        paddingHorizontal: spacingX._8,
    }
});