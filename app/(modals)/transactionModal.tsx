import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { scale, verticalScale } from '@/utils/styling';
import ModalWrapper from '@/components/ModalWrapper';
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';
import { Image } from 'expo-image';
import { getProfileImage } from '@/services/ImageService';
import * as Icons from 'phosphor-react-native';
import Typo from '@/components/Typo';
import Input from '@/components/Input';
import { TransactionType, WalletType } from '@/types';
import Button from '@/components/Button';
import { useAuth } from '@/context/authContext';
import { updateUser } from '@/services/userService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'
  import { Dropdown } from 'react-native-element-dropdown';

import ImageUpload from '@/components/ImageUpload';
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService';
import { transactionTypes } from '@/constants/data';

const TransactionModal = () => {
  const {user} = useAuth();
  const [transaction, setTransaction] = useState<TransactionType>({
   type:'expense',
   amount:0,
   description:'',
   category:'',
   date: new Date(),
   walletId:'',
    image:null,
  })

  const [loading, setLoading] = useState(false)
  const router = useRouter()


  const oldTransaction: {name:string; image:string; id:string} = useLocalSearchParams();

  console.log({oldTransaction});

  // useEffect(()=>{
  //   if(oldTransaction?.id){
  //     setTransaction({
  //       name:oldTransaction?.name,
  //       image:oldTransaction?.image
  //     })
  //   }
  // },[]);

  const onSubmit =async ()=>{
  //   let {name, image} = transaction;
  //   if(!name.trim() || !image) {
  //     Alert.alert("Wallet", "Please fill all the fields");
  //     return;
  //   }

  //   const data: WalletType = {
  //     name,
  //     image,
  //     uid: user?.uid
  //   }

  //   if(oldTransaction?.id) data.id = oldTransaction?.id;
  //       setLoading(true);
  //   const res = await createOrUpdateWallet(data);
  //   setLoading(false);
  //   console.log('result', res)
  //   if(res.success){
       
  //       router.back()
  //   }else{
  //     Alert.alert("User",res.msg)
  //   }
  }

  const onDelete =async()=>{
    if(!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteWallet(oldTransaction?.id);
    setLoading(false);
    if(res.success){
      router.back();
    }else{
      Alert.alert("Wallet", res.msg)
    }
  }

  const showDeleteAlert =( ) =>{
    Alert.alert("Confirm", "Are you sure you want to do this?",
    [
      {text:'Cancel',
        onPress:() => console.log("cancel delete"),
        style:'cancel'
      },
      {text:"Delete",
        onPress:()=> onDelete(),
        style:'destructive'
      }
    ])
  }

    const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];

  const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

  return (
    <ModalWrapper>
     <View style={styles.container}>
      <Header title={oldTransaction?.id ?"Update Transaction":'New Transaction'} leftIcon={<BackButton/>}  style={{marginBottom:spacingY._10}}/>
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
       
        <View style={styles.inputContainer}>
          <Typo color={colors.neutral200}> Type</Typo>
            <Dropdown
          style={styles.dropdownContainer}
          activeColor={colors.neutral700}
          // placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownSelectedText}

          iconStyle={styles.dropdownIcon}
          data={transactionTypes}
      
          maxHeight={300}
          labelField="label"
          valueField="value"
          itemTextStyle={styles.dropdownItemText}
          itemContainerStyle={styles.dropdownItemContainer}
          containerStyle={styles.dropdownListContainer}
          placeholder={!isFocus ? 'Select item' : '...'}
          // searchPlaceholder="Search..."
          value={value}
          // onFocus={() => setIsFocus(true)}
          // onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          // renderLeftIcon={() => (
            // <AntDesign
            //   style={styles.icon}
            //   color={isFocus ? 'blue' : 'black'}
            //   name="Safety"
            //   size={20}
            // />
          // )}
        />
        </View>
        <View style={styles.inputContainer}>
          <Typo color={colors.neutral200}>Transaction Icon</Typo>
          {/* Image input */}
          <ImageUpload 
            file={transaction?.image} 
            onClear={()=> setTransaction({...transaction, image:null})}
            onSelect={file=> setTransaction({...transaction, image:file })} 
            placeholder='Upload Image'/>
        </View>

      </ScrollView>
     </View>

    <View style={styles.footer}>
      {oldTransaction?.id && (
        <Button style={{
            backgroundColor: colors.rose,
            paddingHorizontal: spacingX._15
          }} onPress={showDeleteAlert} >
            <Icons.Trash
              color={colors.white}
              size={verticalScale(24)}
              weight='bold' />
          </Button>
      )}

    
        <Button onPress={onSubmit} loading={loading} style={{flex:1}}>
          <Typo color={colors.black} fontWeight={"700"}>{oldTransaction?.id ?"Update Wallet":'Add Wallet'}</Typo>
        </Button>
      </View>
    </ModalWrapper>

  )
}

export default TransactionModal

const styles = StyleSheet.create({
  container:{
    flex:1,
    paddingHorizontal:spacingY._20
  },
  footer:{
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'center',
    paddingHorizontal:spacingX._20,
    gap:scale(12),
    paddingTop:spacingY._15,
    borderTopColor:colors.neutral700,
    marginBottom:spacingY._5,
    borderTopWidth:1,
  },
  form:{
    gap:spacingY._30,
    paddingVertical:spacingY._15,
    paddingBottom:spacingY._40
  },
  inputContainer:{
    gap:spacingY._10
  },
  iosDropDown:{
    flexDirection:'row',
     height:verticalScale(54),
    alignItems:'center',
    justifyContent:'center',
    borderWidth:1,
    fontSize:verticalScale(14),
    paddingHorizontal:spacingX._15,
    color:colors.white,
    borderColor:colors.neutral300,
    borderRadius:radius._17,
    borderCurve:'continuous'
  },
  androidDropDown:{
    height:verticalScale(54),
    alignItems:'center',
    justifyContent:'center',
    borderWidth:1,
    fontSize:verticalScale(14),
    color:colors.white,
    borderColor:colors.neutral300,
    borderRadius:radius._17,
    borderCurve:'continuous'
  },
  flexRow:{
    flexDirection:'row',
    alignItems:'center',
    gap:spacingX._5
  },
  dateInput:{
    flexDirection:'row',
    height:verticalScale(54),
    alignItems:"center",
    borderWidth:1,
    borderColor:colors.neutral300,
    borderRadius:radius._17,
    borderCurve:'continuous',
    paddingHorizontal:spacingX._15
  },
  iosDatePicker:{
    // backgroundColor:'red'
  },
  dropdownContainer:{
    height:verticalScale(54),
    borderWidth:1,
    borderColor:colors.neutral300,
    paddingHorizontal:spacingX._15,
    borderRadius: radius._15,
    borderCurve:'continuous'
  },
  dropdownItemText:{
    color:colors.white
  },
  dropdownSelectedText:{
    color:colors.white,
    fontSize:verticalScale(14)
  },
  dropdownListContainer:{
    backgroundColor:colors.neutral900,
    borderRadius:radius._15,
    borderCurve:'continuous',
    paddingVertical:spacingY._7,
    top:5,
    borderColor:colors.neutral500,
    shadowColor:colors.black,
    shadowOffset:{width:0,height:5},
    shadowOpacity:1,
    shadowRadius:15,
    elevation:5
  },
  dropdownPlaceholder:{
    color:colors.white
  },
  dropdownItemContainer:{
    borderRadius:radius._15,
    marginHorizontal:spacingX._7,
  },
  dropdownIcon:{
    height:verticalScale(30),
    tintColor:colors.neutral300
  }
 
})