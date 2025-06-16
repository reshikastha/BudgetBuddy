import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import Typo from '@/components/Typo'
import { useAuth } from '@/context/authContext'
import {Image} from 'expo-image';
import { getProfileImage } from '@/services/ImageService'
import { accountOptionType } from '@/types'
import * as Icons from 'phosphor-react-native'
import Animated, { FadeIn, FadeInDown }  from 'react-native-reanimated'
import { signOut } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useRouter } from 'expo-router'

const Profile = () => {
  const {user} = useAuth();
  const router = useRouter();

  const handleLogout =async()=>{
    await signOut(auth)
  }
  const accountOption: accountOptionType[] = [
    {
      title:'Edit Profile',
      icon:(
        <Icons.User
          size={26}
          color={colors.white}
          weight='fill'/>
      ),
      routeName:'/(modals)/profileModal',
      bgColor:'#6366f1'
    },
    {
      title:'Settings',
      icon:(
        <Icons.GearSix
          size={26}
          color={colors.white}
          weight='fill'/>
      ),
      // routeName:'/(modals)/profileModal',
      bgColor:'#059669'
    },
    {
      title:'Privacy Policy',
      icon:(
        <Icons.Lock
          size={26}
          color={colors.white}
          weight='fill'/>
      ),
      // routeName:'/(modals)/profileModal',
      bgColor:colors.neutral600
    },
    {
      title:'Logout',
      icon:(
        <Icons.Power
          size={26}
          color={colors.white}
          weight='fill'/>
      ),
      // routeName:'/(modals)/profileModal',
      bgColor:'#e11d48'
    }
  ]

  const showLogoutAlert =()=>{
    Alert.alert("Confirm","Are u sure want to logout?", [
      {
        text: "Cancel",
        onPress:()=> console.log("Cancel"),
        style: 'cancel'
      },
      {
        text: "Logout",
        onPress:()=> handleLogout(),
        style: 'destructive'
      }
    ])
  }

  const handlePress = (item : accountOptionType)=>{
    if (item.title == 'Logout'){
      showLogoutAlert();
    }

    if (item.routeName) router.push(item.routeName);
  }
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title='Profile' leftIcon ={<BackButton/>}/>

        <View style={styles.userInfo}>
          <View>
              <Image 
                source={getProfileImage(user?.image)}
                style={styles.avatar}
                contentFit='cover'
                transition ={100}
                />
          </View>  

          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"} color={colors.neutral100}>
              {user?.name}
            </Typo>
            <Typo size={15}  color={colors.neutral100}>
              {user?.email}
            </Typo>
          </View>
        </View>

        <View style={styles.accountOptions}>
          {accountOption.map((item, index)=>{
            return(
              <Animated.View 
                entering={FadeInDown.delay(index*50)}
                style={styles.listItem}>
                <TouchableOpacity style={styles.flexRow} onPress={() => handlePress(item)}>
                  <View style={[styles.listIcon,{
                    backgroundColor:item?.bgColor
                  }]}>
                    {item?.icon}
                  </View>
                <Typo size={18} style={{ marginLeft:10, justifyContent:'center'}} fontWeight={"500"}>{item?.title}</Typo>

                <Icons.CaretRight
                  size={verticalScale(20)}
                  weight='bold'
                  color={colors.white}
                  style={styles.rightIcon}
                  />
                </TouchableOpacity>
                
              </Animated.View>
            )
          })}
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Profile

const styles = StyleSheet.create({
  container:{
    // flex:1,
    paddingHorizontal: spacingX._20,
  },
  userInfo:{
    marginTop: verticalScale(30),
    alignItems:"center",
    gap:spacingY._15,
  },
  avatarContainer:{
    position:'relative',
    alignSelf:'center'
  },
  avatar:{
    alignSelf:'center',
    backgroundColor:colors.neutral300,
    height:verticalScale(135),
    width:verticalScale(135),
    borderRadius:200,
  },
  editIcon:{
    position:'absolute',
    bottom:5,
    right:8,
    borderRadius:50,
    backgroundColor:colors.neutral100,
    shadowColor:colors.black,
    shadowOffset:{width:0, height:0},
    shadowOpacity:0.25,
    shadowRadius:10,
    elevation:4,
    padding:5 
  },
  nameContainer:{
    gap:verticalScale(4),
    alignItems:"center",
  },
  listIcon:{
    height:verticalScale(44),
    width:verticalScale(44),
    backgroundColor:colors.neutral500,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:radius._15,
    borderCurve:'continuous',
  },
  listItem:{
    marginBottom:verticalScale(17),
  },
  accountOptions:{
    marginTop:spacingY._35,
  },
  flexRow:{
    flexDirection:'row',
    alignItems:'center',
    gap:spacingX._10
  },
  rightIcon: {
    position: 'absolute',
    right: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
})