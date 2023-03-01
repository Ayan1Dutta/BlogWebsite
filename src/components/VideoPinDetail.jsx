import {
  Box,
  Flex,
  Grid,
  GridItem,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  useColorModeValue,
  Image,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverFooter,
  ButtonGroup,
  Textarea,
} from "@chakra-ui/react";
import { getFirestore } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { IoHome, IoPause, IoPlay, IoTrash } from "react-icons/io5";
import { FcApproval } from "react-icons/fc";
import {
  MdForward10,
  MdFullscreen,
  MdOutlineReplay10,
  MdVolumeOff,
  MdVolumeUp,
} from "react-icons/md";
import ReactPlayer from "react-player";
import { Link, useNavigate, useParams } from "react-router-dom";

import Spinner from "../Spinner";
import { app as firebaseApp } from "../firebaseconfig";
import {
  deleteVideo,
  getUserInfo,
  getSpecificVideo,
  recommendedFeed,
} from "../userTools/fetchData";

import screenfull from "screenfull";
import HTMLReactParser from "html-react-parser";
import moment from "moment";
import { fetchuser as fetchUser } from "../userTools/fetchUser";
import RecommendedVideos from "./RecommendedVideos";

const format = (seconds) => {
  if (isNaN(seconds)) {
    return "00:00";
  }

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");

  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")} : ${ss}`;
    // 01:02:32
  }

  return `${mm}:${ss}`;
  // 02:35
};


const VideoPinDetail = () => {
  const { videoId } = useParams();
  const textColor = useColorModeValue("gray.900", "gray.50");
  const navigate = useNavigate();
  // firestore database instance
  const firestoreDB = getFirestore(firebaseApp);
  const [localUser] = fetchUser();

  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [feeds, setFeeds] = useState(null);
  const [height, setheight] = useState("40vh")

  // Custom reference
  const playerRef = useRef();
  const playerContainer = useRef();
  

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      getSpecificVideo(firestoreDB, videoId).then((data) => {
        setVideoInfo(data);

        recommendedFeed(firestoreDB, data.category, videoId).then((feed) => {
          setFeeds(feed);
        });

        getUserInfo(firestoreDB, data.userId).then((user) => {
          setUserInfo(user);
        });

        setIsLoading(false);
      });
    }
  }, [videoId]);

  useEffect(() => { }, [muted, volume, played]);

  const onvolumechange = (e) => {
    setVolume(parseFloat(e / 100));

    e === 0 ? setMuted(true) : setMuted(false);
  };

  const handleFastRewind = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
  };

  const handleFastForward = () => {
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
  };

  const handleProgress = (changeState) => {
    if (!seeking) {
      setPlayed(parseFloat(changeState.played / 100) * 100);
    }
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e / 100));
  };

  const onSeekMouseDown = (e) => {
    setSeeking(true);
  };

  const onSeekMouseUp = (e) => {
    setSeeking(false);
    playerRef.current.seekTo(e / 100);
  };

  const currentTime = playerRef.current
    ? playerRef.current.getCurrentTime()
    : "00:00";

  const duration = playerRef.current
    ? playerRef.current.getDuration()
    : "00:00";

  const elapsedTime = format(currentTime);
  const totalDuration = format(duration);

  const deleteTheVideo = (videoId,url) => {
    setIsLoading(true);
    deleteVideo(firestoreDB, videoId,url);
    navigate("/", { replace: true });
  };

  if (isLoading) return <Flex marginTop={"30vh"}>
    <Spinner msg={"loading...."} />
  </Flex>

  return (
    <Flex
      width={"full"}
      height="auto"
      justifyContent={"center"}
      alignItems="center"
      direction={"column"}
      py={2}
      px={4}
      marginLeft={"50px"}
    >
      <Flex alignItems={"center"} width="full" my={4}>
        <Link to={"/"}>
          <IoHome fontSize={25} />
        </Link>
        <Box width="1px" height={"25px"} bg={"gray.500"} mx={2}></Box>
        <Text

          color={textColor}
          fontWeight="semibold"
          width={"100%"}
        >
          {videoInfo?.title}
        </Text>
      </Flex>

      {/* Main Grid for video */}
      <Grid templateColumns="repeat(3, 1fr)" gap={"1vw"} width="100%" >
        <GridItem width={"100%"} colSpan="2">
          <Flex
            width={"full"}
            bg="black"
            position="relative"
            ref={playerContainer}
          >
            <ReactPlayer
              ref={playerRef}
              url={videoInfo?.videoURL}
              width="100%"
              height={height}
              playing={isPlaying}
              muted={muted}
              volume={volume}
              onProgress={handleProgress}
            />

            {/* Controls for video Player */}
            <Flex
              position={"absolute"}
              top={0}
              left={0}
              right={0}
              bottom={0}
              direction="column"
              justifyContent={"space-between"}
              alignItems="center"
              zIndex={1}
              cursor="pointer"
            >
              {/* play icon */}
              <Flex
                alignItems={"center"}
                justifyContent="center"
                onClick={() => {
                  setIsPlaying(!isPlaying);
                }}
                width="full"
                height="full"
                marginTop={"25px"}
              >
                {!isPlaying && (
                  <IoPlay  fontSize={"30px"} color="#f2f2f2" cursor={"pointer"} />
                )}
              </Flex>

              {/* Progres Controls */}
              <Flex
                width={"full"}
                alignItems="center"
                direction={"column"}
                px={"1vw"}
                pb = {"1vh"}
                bgGradient="linear(to-t, blackAlpha.900, blackAlpha.500, blackAlpha.50)"
              >
                <Slider
                  aria-label="slider-ex-4"
                  min={0}
                  max={100}
                  size= "sm"
                  value={played * 100}
                  transition="ease-in-out"
                  transitionDuration={"0.2"}
                  onChange={handleSeekChange}
                  onMouseDown={onSeekMouseDown}
                  onChangeEnd={onSeekMouseUp}
                >
                  <SliderTrack bg="teal.50" height={"3px"}>
                    <SliderFilledTrack bg="teal.300" />
                  </SliderTrack>
                  <SliderThumb
                    boxSize={"10px"}
                    bg="teal.300"
                    transition="ease-in-out"
                    transitionDuration={"0.2"}
                  />
                </Slider>

                {/* Other player Controls */}
                <Flex width={"full"} alignItems="center"  gap={"0.7vw"}>
                  <MdOutlineReplay10
                    fontSize={"17px"}
                    color={"#f1f1f1"}
                    cursor="pointer"
                    onClick={handleFastRewind}
                  />

                  <Box onClick={() => setIsPlaying(!isPlaying)}>
                    {!isPlaying ? (
                      <IoPlay
                        fontSize={"17px"}
                        color="#f2f2f2"
                        cursor={"pointer"}
                      />
                    ) : (
                      <IoPause
                        fontSize={"17px"}
                        color="#f2f2f2"
                        cursor={"pointer"}
                      />
                    )}
                  </Box>

                  <MdForward10
                    fontSize={"17px"}
                    color={"#f1f1f1"}
                    cursor="pointer"
                    onClick={handleFastForward}
                  />

                  {/* Volume Controls */}
                  <Flex alignItems={"center"}>
                    <Box onClick={() => setMuted(!muted)}>
                      {!muted ? (
                        <MdVolumeUp
                          fontSize={"17px"}
                          color="#f1f1f1"
                          cursor="pointer"
                        />
                      ) : (
                        <MdVolumeOff
                          fontSize={'17px'}
                          color="#f1f1f1"
                          cursor="pointer"
                        />
                      )}
                    </Box>
                    <Slider
                      aria-label="slider-ex-1"
                      defaultValue={volume * 100}
                      min={0}
                      max={100}
                      size="sm"
                      width={"4.5vw"}
                      display={{base:"none",sm:"block"}}
                      mx={2}
                      onChangeStart={onvolumechange}
                      onChangeEnd={onvolumechange}
                    >
                      <SliderTrack bg="teal.50"  height={"0.2vw"}>
                        <SliderFilledTrack bg="teal.300" />
                      </SliderTrack>
                      <SliderThumb boxSize={"8px"} bg="teal.300" />
                    </Slider>
                  </Flex>

                  {/* duration of video */}
                  <Flex alignItems={"center"} gap={"0.5vw"}>
                    <Text fontSize={"14px"} color="whitesmoke" display={{base:"none",md:"block"}}>
                      {elapsedTime}
                    </Text>
                    <Text fontSize={"14px"} color="whitesmoke" display={{base:"none",md:"block"}}>
                      /
                    </Text>
                    <Text fontSize={"14px"} color="whitesmoke" display={{base:"none",md:"block"}}>
                      {totalDuration}
                    </Text>
                  </Flex>

                  <Image src= "" width={"3vw"} ml="auto" />
                  <MdFullscreen
                    fontSize={"25px"}
                    color="#f1f1f1"
                    cursor={"pointer"}
                    onClick={() => {
                        if (screenfull.isFullscreen == false) setheight("100%");
                        else setheight("40vh")
                        screenfull.toggle(playerContainer.current);
                      }}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>


          {/* Video Description */}
          {videoInfo?.description && (
            <Flex my={"2vw"} direction="column">
              <Text my={"1vw"} fontSize={{ lg: "1.5vw", sm: "3vw" }} fontWeight="semibold">
                Description
              </Text>
              <Box fontSize={{ lg: "1.2vw", sm: "2.8vw" }}>  {HTMLReactParser(videoInfo?.description)}  </Box>
            </Flex>
          )}
        </GridItem>
        <GridItem width={"100%"} colSpan="1" marginLeft={{base:"20px"}}>
          {userInfo && (
            <Flex direction={"column"} width={"full"}>
              <Flex alignItems={"center"} width="full">
                <Image
                  src={userInfo?.photoURL}
                  rounded="full"
                  width={"5vw"}
                  height={"5vw"}
                  minHeight="5vw"
                  minWidth={"5vw"}
                />

                <Flex direction={"column"} ml={"1vw"}>
                  <Flex alignItems={"center"}>
                    <Text color={textColor} fontWeight="semibold" fontSize={"1.5vw"}>
                      {userInfo?.displayName}
                    </Text>
                    <FcApproval fontSize={{ sm: "50vw" }} />
                  </Flex>
                  {videoInfo?.id && (
                    <Text fontSize={"1.5vw"}>
                      {moment(
                        new Date(parseInt(videoInfo.id)).toISOString()
                      ).fromNow()}
                    </Text>
                  )}
                </Flex>
              </Flex>

              {/* Ction Buttons */}
              <Flex justifyContent={"space-around"} mt={"3vw"}>
                {userInfo?.uid === localUser.uid && (
                  <Popover closeOnEsc>
                    <PopoverTrigger>
                      <Button width={"5vw"} mt="0.45vw" height={"3.9vw"} colorScheme={"red"}>
                        <IoTrash fontSize={"2vw"} color="#fff" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Confirmation!</PopoverHeader>
                      <PopoverBody>
                        Are you sure you want to delete it?
                      </PopoverBody>

                      <PopoverFooter d="flex" justifyContent="flex-end">
                        <ButtonGroup size="sm">
                          <Button
                            colorScheme="red"
                            onClick={() => deleteTheVideo(videoId,videoInfo.videoURL)}
                          >
                            Yes
                          </Button>
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                )}

                <a
                  href={videoInfo.videoURL}
                  download
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    colorScheme={"whatsapp"}
                    rounded="md"
                    width={"15vw"}
                    height="4vw"
                    my={"2.7vw"}
                    mt={"0"}


                  >
                    <Text fontSize={"2vw"}> Download</Text>
                  </Button>
                </a>
              </Flex>
            </Flex>
          )}
        </GridItem>
      </Grid>

      {feeds && (
        <Flex direction={"column"} width="full" my={"2vw"}>
          <Text my={"3vw"} fontSize={"3vw"} fontWeight="semibold">
            Recommended Videos
          </Text>
          <RecommendedVideos feeds={feeds} />
        </Flex>
      )}
    </Flex>
  );
};

export default VideoPinDetail;