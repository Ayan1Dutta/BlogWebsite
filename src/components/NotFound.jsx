import { Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import notFoundSvg from "../pictures/notfound.svg";

const NotFound = () => {
  return (
    <Flex
      width={"full"}
      justifyContent="center"
      alignItems={"center"}
      direction="column"
      marginLeft={"50px"}
    >
      <Image src={notFoundSvg} width={600} />
      <Text fontSize={40} fontWeight="semibold" fontFamily={"cursive"}>
        Not Found
      </Text>
    </Flex>
  );
};

export default NotFound;