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
    <ScreenWrapper style={{ backgroundColor: colors.bg }}>
      <View style={styles.container}>
        <BackButton />

        <View style={styles.headerContainer}>
            <Typo size={32} fontWeight={"800"} color={colors.text}>Let's</Typo>
            <Typo size={32} fontWeight={"800"} color={colors.primary}>Get Started!</Typo>
        </View>

        <View style={styles.formCard}>
            <View style={styles.form}>
                <Typo size={16} color={colors.textSecondary} style={styles.subtitle}>
                    Create an account
                </Typo>
                <Input 
                    onChangeText={(value) => (nameRef.current = value)} 
                    placeholder='Enter your name' 
                    icon={<Feather name="user" size={verticalScale(16)} color={colors.primary} />}
                    style={styles.input}
                />
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

                <Button 
                    loading={isLoading} 
                    onPress={() => handleSubmit()}
                    style={styles.signUpButton}
                >
                    <Typo size={16} fontWeight={"700"} color={colors.white}>Sign Up</Typo>
                </Button>
            </View>
        </View>

        <View style={styles.footer}>
            <Typo size={14} color={colors.textMuted}>Already have an account?</Typo>
            
            <Pressable onPress={() => router.push('/(auth)/login')} style={styles.loginButton}>
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
        gap: spacingY._15
    },
    input: {
        flex: 1,
        borderColor: colors.neutral300,
    },
    signUpButton: {
        backgroundColor: colors.primary,
        borderRadius: radius._12,
        marginTop: spacingY._10,
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
    loginButton: {
        paddingVertical: spacingY._5,
        paddingHorizontal: spacingX._8,
    }
});