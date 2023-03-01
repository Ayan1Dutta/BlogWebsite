import { Flex } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Category from '../components/Category'
import NavBar from '../components/Navbar'
import { categories } from '../data'
import '../category.css'
import '../home.css'
import { fetchuser } from '../userTools/fetchUser'
const Home = () => {
  const [user, setuser] = useState(fetchuser);
  return (
    <>
      <NavBar user={user} />
       <Flex width={"100vw"} >
        <Flex  direction={"column"} justifyContent="start" alignItems={"center"} width={{ base: '9%', md: '7%', lg: '5%' }} marginLeft={{base:"1vw",sm:"1vw",md:"1vw",lg:"0vw"}} 
        position='fixed' marginTop={"100px"}>
          {categories && categories.map(data => <Category key={data.id} data={data} />)}
        </Flex>
         <Flex className="homeStyle" width={{ base: '91%', md: '93%', lg: '95%' }} px = "1"  justifyContent= {"center"} alignItems = "center" ml={'1'}
          marginLeft={{sm:"50px",md:"50px"}} marginTop={"100px"} >
          <Outlet />
        </Flex>
      </Flex> 
    </>
  )
}

export default Home