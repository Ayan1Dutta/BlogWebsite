import React, { useEffect, useRef } from 'react'
import { InputGroup, useColorMode, useColorModeValue, MenuList, Flex, Menu, Input, MenuButton, MenuItem, Text, InputLeftElement, Button, FormLabel } from "@chakra-ui/react"
import { useState } from "react"
import { categories } from "../data.js"
import { IoChevronDown, IoCloudUpload, IoLocation, IoPause, IoPlay, IoTrash , IoCheckmark, IoWarning } from 'react-icons/io5'
import Spinner from "../Spinner"
import JoditEditor from 'jodit-react';
import {doc , getFirestore} from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { app as firebaseApp } from "../firebaseconfig"
import AlertMsg from '../AlertMsg'
import { setDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { fetchuser as fetchUser  } from '../userTools/fetchUser';
import "../App.css"
import RichEditor from './RichEditor.jsx'

let uploadTask;




function Create() {

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Category");
  const [videoAsset, setVideoAsset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(1);
  const [pause, setPause] = useState(true);
  const [msg, setMsg] = useState("Uploading your video");
  const [alert, setAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alertIcon, setAlertIcon] = useState(null);
  const [description, setDescription] = useState("");
  const [uploadPressed, setUploadPressed] = useState(false);
  const userInfo =   fetchUser();
  const storage = getStorage(firebaseApp);
   const editor = useRef(null);
   const firebaseDB = getFirestore(firebaseApp);
   const navigate = useNavigate();

  
  



  function uploadImage(e) {
    setLoading(true);
    setMsg("Uploading your video");
    const videoFile = e.target.files[0];
    const storageRef = ref(storage, `Videos/${Date.now()}-${videoFile.name}`);
    uploadTask = uploadBytesResumable(storageRef, videoFile);

    uploadTask.on('state_changed',
      (snapshot) => {

        const prg = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(prg);
        switch (snapshot.state) {
          case 'paused':
            setPause(true);
            setMsg("Uploading paused");
            break;
          case 'running':
            setPause(false);
            setMsg("Uploading your video");

            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoAsset(downloadURL);
          
          setLoading(false);
          setAlert(true);
          setAlertStatus("success");
          setAlertMsg("Your video is uploaded successfully");
          setAlertIcon(<IoCheckmark fontSize={25}/>)

          setTimeout(() => {
            setAlert(false);
          }, 2000);

        });
      }
    );

  }


  useEffect( () => {}, [title , location , description , category]);


  async function uploadDetails() {
    try {
      setUploadPressed(true);
      if(!title || !category || !videoAsset){
          setAlert(true);
          setAlertStatus("error");
          setAlertMsg("Required fields are missing");
          setAlertIcon(<IoWarning fontSize={25}/>)

          setTimeout(() => {
            setAlert(false);
          }, 2000);

          setUploadPressed(false);
           
      }else {
        const data = {
          id : `${Date.now()}`,
          userId : userInfo[0].uid,
          title : title,
          description : description,
          location : location,
          category : category,
          videoURL : videoAsset,

        }
   await setDoc(doc(firebaseDB,"videos", `${Date.now()}`) ,data );
   setUploadPressed(false);
   setLoading(false);
   setPause(false);
   setMsg("Uploading your video");
   setProgress(1);


   setAlert(true);
   setAlertStatus("success");
   setAlertMsg("Your video is uploaded successfully");
   setAlertIcon(<IoCheckmark fontSize={25}/>)

    setTimeout(() => {
     setAlert(false);
   }, 2000);

   navigate("/", {replace : true});



      }

    }catch (error ) {
      console.log(error);
    }

  }



  async function deleteImage() {
  const deleteRef = ref(storage,videoAsset);
   await deleteObject(deleteRef).then(() => {
      setVideoAsset(null);
      setLoading(false);
      setPause(false);
      setMsg("Uploading your video");
      setProgress(1);

      setAlert(true);
          setAlertStatus("error");
          setAlertMsg("Your video was removed");
          setAlertIcon(<IoWarning/>)

          setTimeout(() => {
            setAlert(false);
          }, 2000);

    }).catch((error) => {
   console.log(error);
    })

  }

  async function resumeUpload() {
    await uploadTask.resume();
    setPause(false);
  }


  function cancelUpload(){
    uploadTask.cancel();
   console.log("upload canceled");
    setMsg("Uploading your video");
    setVideoAsset(null);
    setPause(false);
    setProgress(1);
    setLoading(false);
  }





  const { colorMode } = useColorMode();
  const bg = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.900', 'gray.50');
  return (
    <Flex justifyContent={"center"} alignItems='center' width={'full'} 
      paddingRight={"5px"} py="5" marginLeft={"50px"} minWidth={"340px"}

    >

      <Flex
        width={"90%"}
        height="full"
        border={"1px"}
        borderColor="gray.300"
        borderRadius={"md"}
        p="3"
        flexDirection={"column"}
        alignItems="center"
        justifyContent={"center"}
        gap={2}
      >

        {alert && (
        <AlertMsg  status = {alertStatus} msg = {alertMsg} icon = {alertIcon} />
        )}

        <Input
          variant={"flushed"}
          placeholder="Title"
          focusBorderColor="gray.400"
          isRequired
          errorBorderColor="red"
          type={"text"}
          _placeholder={{ color: "gray.500" }}
          fontSize={20}
          value={title}
          onChange={(e) => setTitle(e.target.value)}

        />
        <Flex
          justifyContent={"space-between"}
          width="full"
          alignItems={"center"}
          gap={8}
          my={4}
        >
          <Menu>
            <MenuButton
              width={"full"}
              colorScheme="blue"
              as={Button}
              fontSize={14}
              rightIcon={<IoChevronDown fontSize={14} />}
            >
              {category}
            </MenuButton>
            <MenuList zIndex={101} width={{base:"10%",md:"20%"}} shadow="xl">
              {categories && categories.map((data) => (
                <MenuItem
                  key={data.id}
                  _hover={{ bg: "blackAlpha.300" }}
                  fontSize={17}
                  px={4}
                  onClick={() => setCategory(data.name)}
                >
                  {data.iconSrc}
                  <Text fontSize={15} ml={4}>
                    {data.name}
                  </Text>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={
                <IoLocation
                  fontSize={17}
                  color={`${colorMode === "dark" ? "#f1f1f1" : "#111"}`}
                />
              }
            />
            <Input
              variant={"flushed"}
              placeholder="Location"
              focusBorderColor="gray.400"
              isRequired
              errorBorderColor="red"
              type={"text"}
              _placeholder={{ color: "gray.500" }}
              fontSize={14}
              value={location}
              padding={"0px"}
              marginLeft={"30px"}
              onChange={(e) => setLocation(e.target.value)}
            />
          </InputGroup>
        </Flex>


        <Flex
          border={"1px"}
          borderColor="gray.500"
          height={"400px"}
          borderStyle="dashed"
          width="full"
          borderRadius={"md"}
          overflow="hidden"
          position={"relative"}

        >

          {!videoAsset ? (
            <FormLabel width={"full"} >
              <Flex direction={"coloum"}
                alignItems="center"
                justifyContent={"center"}
                height="full"
                width={"full"}
              >

                <Flex direction={"coloum"}
                  alignItems="center"
                  justifyContent={"center"}
                  height="full"
                  width={"full"}
                  cursor="pointer"
                >
                  {loading 

                  ? (<Flex direction={"column"}  alignItems="center"  >
                    <Spinner msg={msg} progress={progress} />
                    {pause === false ? <Button  margin={2} onClick={() => uploadTask.pause() }  colorScheme = {"linkedin"}> <IoPause color={textColor} fontSize={"15"}  /> Pause</Button>
                      : <Button   margin={2} onClick= {resumeUpload } colorScheme = {"linkedin"} >  <IoPlay color={textColor} fontSize={"15"} /> Resume</Button>
                    }
                    <Button onClick={cancelUpload}>Cancel</Button></Flex>)

                    : (<Flex direction={"column"} justifyContent={"center"} alignItems="center" >
                        <div> <IoCloudUpload fontSize={28}
                          color={`${colorMode === "dark" ? "#f1f1f1" : "#111"}`}
                        /></div>
                        <div>
                          <Text mt={"5"} fontSize={20} color={textColor}
                          >Click here to upload</Text></div>

                      </Flex>
                    )}
                </Flex>

              </Flex>

              {!loading && (<input
                type="file"
                name='upload_image'
                onChange={uploadImage}
                style={{ width: 0, height: 0 }}
                accept="video/mp4 , video/x-miv , video/*"
              />)}

            </FormLabel>

          )
            : (<Flex alignItems="center"
              justifyContent={"center"}
              height="full"
              width={"full"}
              position={"relative"}

            >
              <Flex alignItems="center"
                justifyContent={"center"}
                height="40px"
                width={"40px"}
                rounded="full"
                cursor={"pointer"}
                zIndex={10}
                bg={"red"}
                top={5}
                right={5}
                onClick = {deleteImage}
                position={"absolute"}> 

                <IoTrash fontSize={20} color="white" />

              </Flex>
              <video src={videoAsset} controls style={{ width: "100%", height: "100%" }} />

            </Flex>)}

        </Flex>
         <Flex direction={"column"}  maxWidth = "100%" minWidth={"100%"} minHeight ={"250px"} alignItems={"center"} justifyContent ="center" >
                <RichEditor setDescription={setDescription} textColor={textColor} colorMode={colorMode}/>
        </Flex>

        { videoAsset ? <Button isLoading = {uploadPressed} loadingText = "Uploading" colorScheme={"linkedin"} width = {"full"} fontSize = {20} _hover = {{shadow : "lg"}} 
           onClick = {uploadDetails}
           variant = {`${uploadPressed ? "outline" : "solid"}`}
        >Upload</Button> : null}

      </Flex>

    </Flex>
  )
}

export default Create