import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';


dotenv.config();

const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decodedToken.userId;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

export default getUserIdFromToken;
