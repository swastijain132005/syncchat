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
        const [typingUser, setTypingUser] = useState("");


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
        const {data}= await axios.post(`/api/messages/send/${selectedUser._id}`,message);
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
const subscribeToMessages = async () => {

    if (!socket) return;

    // ==========================
    // New Message
    // ==========================
    socket.on("newMessage", async (newMessage) => {

        if (
            selectedUser &&
            newMessage.senderId === selectedUser._id
        ) {

            newMessage.seen = true;

            setMessages((prev) => [
                ...prev,
                newMessage,
            ]);

            await axios.put(
                `/api/messages/markAsSeen/${newMessage._id}`
            );

        } else {

            setUnseenMessages((prev) => ({
                ...prev,
                [newMessage.senderId]:
                    prev[newMessage.senderId]
                        ? prev[newMessage.senderId] + 1
                        : 1,
            }));

            setMessages((prev) => [
                ...prev,
                newMessage,
            ]);

        }

    });

    // ==========================
    // New Reaction
    // ==========================
    socket.on("newReaction", (updatedMessage) => {

        setMessages((prev) =>
            prev.map((msg) =>
                msg._id === updatedMessage._id
                    ? updatedMessage
                    : msg
            )
        );

    });

    // ==========================
    // Seen Messages
    // ==========================
    socket.on("messagesSeen", (seenMessages) => {

        setMessages((prev) =>
            prev.map((msg) => {

                const seenMessage = seenMessages.find(
                    (m) => m._id === msg._id
                );

                return seenMessage
                    ? seenMessage
                    : msg;

            })
        );

    });

    // ==========================
    // Typing Indicator
    // ==========================
    socket.on("typing", (senderName) => {

        console.log("🔥 RECEIVED TYPING");
        console.log(senderName);

        setTypingUser(senderName);

    });

    socket.on("stopTyping", () => {

        console.log("🛑 STOP TYPING");

        setTypingUser("");

    });

};


// Remove all listeners
const unsubscribeFromMessages = () => {

    if (!socket) return;

    socket.off("newMessage");
    socket.off("newReaction");
    socket.off("messagesSeen");
    socket.off("typing");
    socket.off("stopTyping");

};


useEffect(() => {

    subscribeToMessages();

    return () => {
        unsubscribeFromMessages();
    };

}, [socket, selectedUser]);

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
typingUser


    }
    return <Chatcontext.Provider value={value}>
{children}


    </Chatcontext.Provider>
}

export const useChatContext=()=>useContext(Chatcontext);