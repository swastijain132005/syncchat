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

    const reactToMessage = async (messageId,emoji) => {

        try {
            const { data } = await axios.put(`/api/messages/${messageId}/react`,{emoji:emoji});
            if(data.success) {
                const messageId=data.updatedMessage._id;
                //setReactions(data.updatedMessage.reactions); no need as it is already set
               setMessages((prev)=>{
              const newmsgs=  prev.map((msg)=>{
                   return  msg._id===messageId?data.updatedMessage:msg
                        
                    
                })
                                    return newmsgs;

               }
            
            )
        } }catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

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
        const {data}= await axios.post(`/api/messages/send/${selectedUser._id}`,{text:message});
        if (data.success) {
setMessages(prev => [...prev, data.newMessage]);        }
    }
    catch (error) {
        toast.error(error.message);
        console.log(error);
    }
}


// Function to edit message
const editMessage = async (messageId, text) => {
    try {

        const { data } = await axios.put(
            `/api/messages/edit/${messageId}`,
            { text }
        );

        if (data.success) {

            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === messageId
                        ? data.updatedMessage
                        : msg
                )
            );

            toast.success("Message updated");
        }

    } catch (error) {

        toast.error(
            error.response?.data?.message || error.message
        );

        console.log(error);

    }
};

// Function to delete message
const deleteMessage = async (messageId) => {

    try {

        const { data } = await axios.delete(
            `/api/messages/delete/${messageId}`
        );

        if (data.success) {

            setMessages((prev) =>
                prev.filter(
                    (msg) => msg._id !== messageId
                )
            );

            toast.success("Message deleted");

        }

    } catch (error) {

        toast.error(
            error.response?.data?.message || error.message
        );

        console.log(error);

    }

};

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

    const subscribeToMessages = async () => {

    if (!socket) return;

    socket.on("newMessage", async (newMessage) => {

        // existing code

    });

    socket.on("newReaction", (updatedMessage) => {

        setMessages((prev) =>
            prev.map((msg) =>
                msg._id === updatedMessage._id
                    ? updatedMessage
                    : msg
            )
        );

    });

};
};


const unsubscribeFromMessages = () => {
    // If socket connection is not established, do nothing
    if (!socket) return;

    // Remove the "newMessage" event listener from the server
    socket.off("newMessage");
    socket.off("newReaction");
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
        unsubscribeFromMessages,
        editMessage,
        reactToMessage,
deleteMessage,


    }
    return <Chatcontext.Provider value={value}>
{children}


    </Chatcontext.Provider>
}

export const useChatContext=()=>useContext(Chatcontext);