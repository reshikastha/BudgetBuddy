import { StyleSheet, Text, View } from 'react-native'
import React, { cloneElement } from 'react'
import { scale, verticalScale } from '@/utils/styling'
import { colors, spacingX, spacingY } from '@/constants/theme'
import * as Icons from 'phosphor-react-native';
import { ImageBackground } from 'expo-image';
import Typo from './Typo';
import useFetchData from '@/hooks/useFetchData';
import { useAuth } from '@/context/authContext';
import { WalletType } from '@/types';
import { where,orderBy } from 'firebase/firestore';

const HomeCard = () => {

    const {user} = useAuth()
    
   
    const {
      data: wallets,
      error,
      loading
    } = useFetchData<WalletType>("wallets",[
      where("uid", "==", user?.uid),
      orderBy("created", "desc")
    ]);

    const getTotals = () =>{
      return wallets.reduce((totals:any, item:WalletType)=>{
        totals.balance = totals.balance + Number(item?.amount);
        totals.income = totals.income + Number(item?.totalIncome);
        totals.expense = totals.expense + Number(item?.totalExpense);
        return totals

      },{balance: 0, income:0, expense: 0})
    }
  return (
  <ImageBackground
  source={require("../assets/images/card.png")}
  contentFit="fill"
  style={styles.bdImage}>

    <View style={styles.container}>
        <View>
            <View style={styles.totalBalanceRow}>
                <Typo color={colors.neutral800} size={17} fontWeight={"500"}>
                    Total Balance
                </Typo>
                <Icons.DotsThreeOutline
                    size={verticalScale(23)}
                    color={colors.black}
                    weight='fill'/>
            </View>
            <Typo color={colors.black} size={30} fontWeight={"bold"}>${getTotals()?.balance?.toFixed(2)}</Typo>
        </View>

        <View style={styles.status}>
            {/* Income */}
            <View style={{gap: verticalScale(5)}}>
                <View style={styles.incomeExpense}>
                    <View style={styles.statsIcon}>
                        <Icons.ArrowDown
                            size={verticalScale(15)}
                            color={colors.black}
                            weight='bold'/>
                    </View>
                    <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                        Income
                    </Typo>
                </View>
                <View style={{alignSelf:'center'}}>
                    <Typo size={17} color={colors.primaryLight} fontWeight={"600"}>
                       ${getTotals()?.income?.toFixed(2)}
                    </Typo>
                </View>

            </View>

                 {/* Expenses */}
             <View style={{gap: verticalScale(5)}}>
                <View style={styles.incomeExpense}>
                    <View style={styles.statsIcon}>
                        <Icons.ArrowDown
                            size={verticalScale(15)}
                            color={colors.black}
                            weight='bold'/>
                    </View>
                    <Typo size={16} color={colors.neutral700} fontWeight={"500"}>
                        Expenses
                    </Typo>
                </View>
                <View style={{alignSelf:'center'}}>
                    <Typo size={17} color={colors.rose} fontWeight={"600"}>
                       ${getTotals()?.expense?.toFixed(2)}
                    </Typo>
                </View>

            </View>
        </View>
    </View>

  </ImageBackground>
  )
}

export default HomeCard

const styles = StyleSheet.create({

    bdImage:{
        height:scale(210),
        width:"100%"
    },
    container:{
        padding:spacingX._20,
        paddingHorizontal:scale(23),
        height:'87%',
        width:"100%",
        justifyContent:'space-between'
    },
    totalBalanceRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:spacingX._5,
    }, 
    status:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    statsIcon:{
        backgroundColor:colors.neutral350,
        padding:spacingY._5,
        borderRadius:50
    },
    incomeExpense:{
        flexDirection:'row',
        alignItems:'center',
        gap:spacingY._7
    }

})