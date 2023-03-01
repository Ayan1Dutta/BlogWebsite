import { Box, Flex, SimpleGrid } from '@chakra-ui/react'
import { getFirestore } from 'firebase/firestore';
import Spinner from '../Spinner';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { app } from '../firebaseconfig';
import {categoryFeeds, getAllFeeds } from '../userTools/fetchData';
import VideoPin from './VideoPin';
import NotFound from './NotFound';

export const Feed = () => {
  const firestoreDb = getFirestore(app);
  const [feeds, setFeeds] = useState(null);
  const [loading, setLoading] = useState(false);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      categoryFeeds(firestoreDb, categoryId).then((data) => {
        setFeeds(data);
        setLoading(false);
      });
    } else {
      getAllFeeds(firestoreDb).then((data) => {
        setFeeds(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  if (loading) return <Flex alignItems={'center'}
  justifyContent='center' marginTop={"30vh"}>
    <Spinner msg={"Loading your feeds"} />
  </Flex>;
  if (!feeds?.length > 0) return <NotFound />;
  return (
    <SimpleGrid
      minChildWidth="300px"
      spacing="15px"
      width="full"
      autoColumns={"max-content"}
      overflowX={"hidden"}
      marginLeft={"50px"}
    >
      {feeds &&
        feeds.map((data) => (
          <VideoPin key={data.id} data={data} />
        ))}
    </SimpleGrid>
  )
}
export default Feed

