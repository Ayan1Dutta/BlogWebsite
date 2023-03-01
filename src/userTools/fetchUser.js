export const userToken=()=>{
    const  accestoken=localStorage.getItem('accesToken')!=='undefiened'?
    JSON.parse(localStorage.getItem('accesToken')):localStorage.clear()
    return accestoken;
}
export const fetchuser=()=>{
    const  userinfo=localStorage.getItem('user')!=='undefiened'?
    JSON.parse(localStorage.getItem('user')):localStorage.clear()
    return userinfo;
}