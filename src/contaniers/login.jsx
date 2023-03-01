import { Button, Flex, HStack, Image } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import music from "../pictures/music.jpg";
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import {firebaseAuth,db} from '../firebaseconfig'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { setDoc,doc } from 'firebase/firestore';
import {  userToken } from '../userTools/fetchUser';
export const Login = () => {
    const nevigate=useNavigate();
    const provider=new GoogleAuthProvider();
    useEffect(()=>{
        const accesstoken=userToken();
        if(accesstoken){
          nevigate('/',{replace:true});
        }
      },[])
    const login= async ()=>{
        const {user}=await signInWithPopup(firebaseAuth,provider);
        const {refreshToken,providerData}=user;
        

        localStorage.setItem('user', JSON.stringify(providerData));
        localStorage.setItem('accesToken',JSON.stringify(refreshToken));

        await setDoc(doc(db,'users',providerData[0].uid),providerData[0]);
        nevigate("/",{replace:true});
    };
    return (
        <Flex justifyContent={"Center"} alignItems={"Center"} width={"100vw"} height={"100vh"}
            position={'relative'} background={'red.100'}>
            <Image src={music} objectFit="cover" width={'full'} height={'full'} ></Image>
            <Flex position={'absolute'} width={'100vw'} height={'100vh'} bg={'blackAlpha.700'} top={'0'} left={'0'} justifyContent={'center'} alignItems={'center'}>
            <HStack>
            <Button leftIcon={<FcGoogle/>} shadow={'lg'} colorScheme={'whiteAlpha'}
            onClick={login}>
                Signin with Google
            </Button> 
            </HStack>
            </Flex>
        </Flex>

    )
}

export default Login