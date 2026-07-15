import { createContext ,useContext} from "react";
import { toast } from "react-hot-toast";

export const Chatcontext=createContext();
import {useAuth} from './Authcontext.jsx'
import {useState} from 'react'
import {useEffect} from 'react'
import {useAI} from './AIcontext.jsx'

export const ChatProvider=({children})=>{

    const [messages,setMessages]=useState([]);
    const [selectedUser,setSelectedUser]=useState(null);
    const[users,setUsers]=useState([]);
    const[unseenMessages,setUnseenMessages]=useState({});
    const {socket,axios}=useAuth();
    const [suggestions,setSuggestions]=useState([]);

const {getReplies}=useAI();

    //function to get all users for sidebar

    const getAllUsers=async()=>{
        try{
            const {data}= await axios.get("/api/messages/sidebar");
            if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
    }
        }
        catch (error) {
            toast.error(error.message);
            console.log(error);
        }
        
    }

//function to get all messages for selected user
const getMessagesForUser=async(userId)=>{
    try{
        const {data}= await axios.get(`/api/messages/${userId}`);
        if (data.success) {
            setMessages(data.messages);
        }
    }
    catch (error) {
        toast.error(error.message);
        console.log(error);
    }
}

// function to send message
const sendMessage=async(message)=>{
    try{
        const {data}= await axios.post(`/api/messages/send/${selectedUser._id}`,message);
        if (data.success) {
setMessages(prev => [...prev, data.newMessage]);        }
    }
    catch (error) {
        toast.error(error.message);
        console.log(error);
    }
}

// Function to subscribe to incoming messages
const subscribeToMessages = async() => {

    // If socket connection is not established, do nothing
    if (!socket) return;

    // Listen for the "newMessage" event from the server
    socket.on("newMessage", async (newMessage) => {

        // Check if the currently selected user is the sender
        if (
            selectedUser &&
            newMessage.senderId === selectedUser._id
        ) {

            // Since this chat is open, mark the message as seen
            newMessage.seen = true;

            // Add the new message to the existing messages
            setMessages((prevMessages) => [
                ...prevMessages,
                newMessage,
            ]);

           await axios.put(`/api/messages/markAsSeen/${newMessage._id}`);
        }
        else {
            // Add the new message to the existing messages
            setUnseenMessages((prevUnseenMessages) => ({
                ...prevUnseenMessages,
[newMessage.senderId]:
  prevUnseenMessages[newMessage.senderId]
    ? prevUnseenMessages[newMessage.senderId] + 1
    : 1            }));
            setMessages((prevMessages) => [
                ...prevMessages,
                newMessage,
            ]);
        }
    });
};


const unsubscribeFromMessages = () => {
    // If socket connection is not established, do nothing
    if (!socket) return;

    // Remove the "newMessage" event listener from the server
    socket.off("newMessage");
};

useEffect(() => {
    // Subscribe to messages when the component mounts
    subscribeToMessages();

    // Unsubscribe from messages when the component unmounts
    return () => unsubscribeFromMessages();
}, [socket, selectedUser]);

    const value={
        messages,
        setMessages,
        selectedUser,
        setSelectedUser,
        users,
        unseenMessages,
        setUnseenMessages,
        getAllUsers,
        getMessagesForUser,
        sendMessage,
        subscribeToMessages,
        unsubscribeFromMessages


    }
    return <Chatcontext.Provider value={value}>
{children}


    </Chatcontext.Provider>
}

export const useChatContext=()=>useContext(Chatcontext);