import { Flex, Progress, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Circles } from "react-loader-spinner";

function Spinner({ msg, progress }) {
    useEffect(() => { }, [progress]);
    return (
        <Flex
            direction={"column"}
            justifyContent={"center"}
            alignItems="center"
            height={"full"}
            px={10}
        >
            <Circles color="#00BFFF" height={80} width={80} />
            <Text fontSize={"30%"} textAlign="center" px={2}>
                {msg}
            </Text>

            {progress && (
                <Progress
                    mt={50}
                    hasStripe
                    isAnimated
                    size="sm"
                    value={Number.parseInt(progress)}
                    width={"60vw"}
                    rounded="sm"
                    colorScheme={"linkedin"}
                />
            )}
        </Flex>
    )
}

export default Spinner