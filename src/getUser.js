import jwt from 'jsonwebtoken'
const APP_SECRET = 'abcdefghijklmnopqrst'

const getUser = token =>{
    const parsedToken = token.split(" ")[1]
    try{
        const decodeToken = jwt.verify(parsedToken,APP_SECRET)
        return decodeToken.userId
    }catch(error){
        return null
    }

}

export default getUser