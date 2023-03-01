import { Box, Flex, Tooltip, useColorMode, useColorModeValue } from '@chakra-ui/react';
import React from 'react'
import { Link } from 'react-router-dom';

const Category = ({data}) => {
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("white.600", "gray.600");
  return (
    <Flex cursor={'pointer'} my='5' mx='5'>
    <Link to={`/category/${data.name}`}>
      <Tooltip hasArrow placement="right" closeDelay={300} arrowSize={5} label={data.name} bg={"black"}
      textColor={"#fff"}>
        <Box>{data.iconSrc}</Box>
      </Tooltip>
    </Link> 

    </Flex>
  )
}

export default Category