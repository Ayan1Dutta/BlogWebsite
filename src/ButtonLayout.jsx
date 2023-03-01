import { Flex } from '@chakra-ui/react'
import React from 'react'
import { IoTrash } from 'react-icons/io5'

function ButtonLayout({click}) {
    return (
        <Flex justifyContent={"center"} alignItems={"center"} direction={'column'}>
            <Flex
                justifyContent={"center"}
                alignItems={"center"}
                width={"40px"}
                height={"40px"}
                rounded="full"
                bg={"red"}
                position={"absolute"}
                cursor={"pointer"}
                zIndex={10}
                onClick={click}
            >
                <IoTrash fontSize={20} color="white" />
            </Flex>
        </Flex>

    )
}

export default ButtonLayout