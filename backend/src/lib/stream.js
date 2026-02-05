import {StreamChat} from "stream-chat";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
 console.error("Stream API key and secret must be set in environment variables");
}

const StreamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await StreamClient.upsertUsers([userData]); // ✅ plural
    return userData;
  } catch (error) {
    console.log("error creating stream user", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    const userIdStr = userId.toString();
   return StreamClient.createToken(userIdStr);
  } catch (error) {
    console.log("error generating stream token", error);
  }
}