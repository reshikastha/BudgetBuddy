import { StyleSheet, Text, TouchableOpacity, View,Image } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Button from '@/components/Button'
import Animated, { FadeIn }  from 'react-native-reanimated'
import { useRouter } from 'expo-router'

const welcome = () => {
    const router = useRouter()
  return (
    <ScreenWrapper>
        <View style={styles.container}>
            <View>
                <TouchableOpacity onPress={()=> router.push('/(auth)/login')} style={styles.loginButton}>
                    <Typo fontWeight={"500"}>Login</Typo>
                </TouchableOpacity>

                <Animated.Image
                entering={FadeIn.duration(3000)}  /// to do animation on the pic take 2 sec to show that pic
                    source={require('../../assets/images/welcome.png')}
                    style={styles.welcomeImage}
                    resizeMode="contain"/>
            </View>

            {/* footer */}
            <View style={styles.footer}>
                <View style={{alignItems:'center'}}>
                    <Typo size={30} fontWeight={"800"}>Take Charge of</Typo>
                    <Typo size={30} fontWeight={"800"}>Every Dollor</Typo>
                </View>
                <View style={{alignItems:'center', gap:2}}>
                    <Typo size={15} color={colors.textLight}>Create smart budgets, track your spending,</Typo>
                    <Typo size={15} color={colors.textLight}>and grow your savings with confidence.</Typo>

                </View>
                <View style={styles.buttonContainer}>
                    <Button onPress={()=> router.push('/(auth)/register')}>
                        <Typo size={20} color={colors.neutral100} fontWeight={"600"}>Let's Begin</Typo>
                    </Button>

                </View>
            </View>
        </View>
    </ScreenWrapper>
  )
}

export default welcome

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"space-between",
        paddingTop:spacingY._7
    },
    welcomeImage:{
        width:"100%",
        height: verticalScale(300),
        alignSelf:'center',
        marginTop: verticalScale(100)
    },
    loginButton:{
        alignSelf:'flex-end',
        marginRight:spacingX._20
    }, 
    footer:{
        backgroundColor:colors.neutral600,
        alignItems:'center',
        paddingTop:verticalScale(30),
        paddingBottom:verticalScale(45),
        gap:spacingY._20,
        shadowColor:'white',
        shadowOffset:{width:0, height:-12},
        elevation:35,
        shadowRadius:40,
        shadowOpacity:0.5
    },
    buttonContainer:{
        width:"100%",
        paddingHorizontal:spacingX._25
    }

})