import React, { useEffect, useRef } from "react";
import assets from "../assets/chat-app-assets/assets.js";
import { messagesDummyData } from "../assets/chat-app-assets/assets.js";
import { formatMessageTime } from "../lib/utils.js";
import { useChatContext } from "../../context/Chatcontext.jsx";
import { useAuth } from "../../context/Authcontext.jsx";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useAI } from "../../context/AIcontext.jsx";
import SummaryModal from "./summarymodal.jsx";
import ToneRewrite from "./Tonerewrite.jsx";
import { DivideSquare } from "lucide-react";
import MessageMenu from "./MessageMenu.jsx";

const ChatContainer = () => {
  const scrollEnd = useRef(null);
  const {messages,selectedUser,setSelectedUser,sendMessage,
    subscribeToMessages,unsubscribeFromMessages,getMessagesForUser,editMessage,deleteMessage,reactToMessage}=useChatContext();
  const {logout,onlineUsers,user}=useAuth();
  const [input,setInput]=useState("");
  const { getReplies ,getConversationSummary,loading,rewriteMessage ,translate} = useAI();
  const [suggestions, setSuggestions] = useState([]);
  const [summary, setSummary] = useState("");
const [showSummary, setShowSummary] = useState(false);
const [showToneModal, setShowToneModal] = useState(false);
const [translations, setTranslations] = useState({});
const [editingMessageId, setEditingMessageId] = useState(null);

const [editedText, setEditedText] = useState("");

const [menuOpen, setMenuOpen] = useState(null);



  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage=async(e)=>{
    if(input.trim()===""){
      return;
    }
      
      await sendMessage({text:input.trim()});
      setInput("");
      setSuggestions([]);
    
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith("image/")) {
        toast.error("Select an image");
        return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
        await sendMessage({
            image: reader.result,
        });
    };

    reader.readAsDataURL(file);
    e.target.value = "";
};
const handleSummary = async () => {
  console.log(messages);

  const aiSummary = await getConversationSummary(messages.slice(-100));
  console.log(aiSummary);

  if (aiSummary) {

    setSummary(aiSummary);

    setShowSummary(true);

  }

};

const handleTranslate = async (msg) => {

    if (translations[msg._id]) {

        setTranslations((prev) => {

            const copy = { ...prev };

            delete copy[msg._id];

            return copy;

        });

        return;

    }

    const translated = await translate(

        msg.text,

        "Hindi"

    );

    setTranslations((prev) => ({

        ...prev,

        [msg._id]: translated,

    }));

};

const regenerateSummary = async () => {

  const aiSummary = await getConversationSummary(messages);

  setSummary(aiSummary);

};

const handleToneSelect = async (tone) => {

    if (!input.trim()) {

        toast.error("Type a message first");

        return;

    }

    const rewritten = await rewriteMessage(

        input,

        tone

    );

    if (rewritten) {

        setInput(rewritten);

    }

    setShowToneModal(false);

};


useEffect(()=>{
  
  if(selectedUser){
    getMessagesForUser(selectedUser._id);
  }
},[selectedUser]);

useEffect(()=>{
  if(scrollEnd.current&&messages.length>0){
    scrollEnd.current.scrollIntoView({ behavior: "smooth" });
  }
},[messages]);


useEffect(() => {
    console.log("Messages:", messages);

    if (!selectedUser) return;

    if (messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    console.log("Last Message:", lastMessage);

    if (lastMessage.senderId !== selectedUser._id) {
        console.log("Not friend's message");
        return;
    }

    console.log("Calling AI...");

    fetchReplies();

    async function fetchReplies() {
        const replies = await getReplies(lastMessage.text);

        console.log("Replies:", replies);

        setSuggestions(replies);
    }

}, [messages, selectedUser]);
    const emojis = [
  "😀",
  "😂",
  "❤️",
  "👍",
  "😮",
  "😢"
];

  return selectedUser ? (
    <div className="h-full overflow-y-scroll relative backdrop-blur-lg">
      {/* ---------------- Header ---------------- */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic||assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />

        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser?.name}
          {onlineUsers.includes(selectedUser._id)&&
          <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7 cursor-pointer"
        />

        <div className="flex items-center gap-4">

    <button
        onClick={handleSummary} 
        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-lg transition"
    >
        📄

        <span className="hidden md:block">

            Summary

        </span>

    </button>

    <img
        src={assets.help_icon}
        alt=""
        className="max-md:hidden max-w-5 cursor-pointer"
    />

</div>
      </div>

      {/* ---------------- Chat Area ---------------- */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-auto p-3 pb-6">
        {messages.map((msg, index) => {

const counts = {};

    msg.reactions?.forEach((react) => {
        counts[react.emoji] = (counts[react.emoji] || 0) + 1;
    });
          
         return <div
            key={msg._id}
            className={`flex items-end gap-2 mb-4 ${
              msg.senderId === user._id
                ? "justify-end"
                : "flex-row-reverse justify-end"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden"
              />
            ) : (
              <div
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all text-white bg-violet-500/30 ${

                  
                  msg.senderId === user._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >

                

                {msg.senderId===user._id && (

<MessageMenu
    msg={msg}
    menuOpen={menuOpen}
    setMenuOpen={setMenuOpen}
    setEditingMessageId={setEditingMessageId}
    setEditedText={setEditedText}
    deleteMessage={deleteMessage}
/>

)}




{
editingMessageId === msg._id ? (

<div>

<input
value={editedText}
onChange={(e)=>
setEditedText(e.target.value)
}
/>

<button
onClick={async()=>{

await editMessage(

msg._id,

editedText

);

setEditingMessageId(null);

}}
>

Save

</button>

<button
onClick={()=>{

setEditingMessageId(null);

}}
>

Cancel

</button>

</div>

) : (

<p>

{msg.text}

</p>


)
}




  


  

                <button

    onClick={() => handleTranslate(msg)}

    className="text-xs text-violet-400 mt-1"

>

🌍 Translate

</button>

{translations[msg._id] && (

<p className="mt-2 text-green-300 italic">

{translations[msg._id]}

</p>

)}
              </div>

              
              
            )}
            <div className="flex gap-1 mt-2 flex-wrap">
    {emojis.map((emoji) => (
        <button
            key={emoji}
            onClick={() => reactToMessage(msg._id, emoji)}
            className="hover:scale-125 transition"
        >
            {emoji}
        </button>

        
    ))}
</div>

{Object.keys(counts).length > 0 && (
    <div className="flex gap-2 mt-2 flex-wrap">
        {Object.keys(counts).map((emoji) => (
            <button
                key={emoji}
                onClick={() => reactToMessage(msg._id, emoji)}
                className="bg-gray-700 rounded-full px-2 py-1 text-sm hover:bg-gray-600 transition"
            >
                {emoji} {counts[emoji]}
            </button>
        ))}
    </div>
)}


            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === user._id
                    ? user?.profilePic||assets.avatar_iconjj
                    : assets.profile_martin
                }
                alt=""
                className="w-7 rounded-full"
              />

              <div className="flex items-center gap-1 text-xs text-gray-400">
    <span>{formatMessageTime(msg.createdAt)}</span>

    {msg.senderId === user._id && (
        <span>
            {msg.seen ? "✓✓" : "✓"}
        </span>
    )}
</div>
            </div>
          </div>
})}

        {

<div className="absolute bottom-20 left-0 right-0 px-4">
  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
    {suggestions.map((reply, index) => (
      <button
        key={index}
        onClick={async () => {
          setInput(reply);

          await sendMessage({
            text: reply,
          });

          setInput("");
          setSuggestions([]);
        }}
        className="
          shrink-0
          px-4
          py-2
          rounded-full
          bg-gradient-to-r
          from-violet-600
          to-purple-500
          hover:from-violet-700
          hover:to-purple-600
          text-white
          text-sm
          font-medium
          shadow-md
          transition-all
          duration-200
          hover:scale-105
          active:scale-95
          whitespace-nowrap
        "
      >
        {reply}
      </button>
    ))}
  </div>
</div>

}


        <div ref={scrollEnd}></div>
      </div>

      {/* ---------------- Bottom Area ---------------- */}
      <div className="flex flex-wrap gap-3 mt-3">


</div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input onChange={(e)=>setInput(e.target.value)} value={input} onKeyDown={(e)=>{
            if(e.key==='Enter'){
              handleSendMessage(e);
              setInput("");
            }
          }}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none bg-transparent text-white placeholder-gray-400"
          />

          <input onChange={handleImageUpload}
            type="file"
            id="image"
            accept="image/png, image/jpeg"
            hidden
          />

          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <button

    onClick={()=>setShowToneModal(true)}

    className="text-violet-400 hover:text-violet-300 text-xl px-2"

>

✨

</button>

        <img onClick={handleSendMessage} src={assets.send_button} alt="" className="w-7 cursor-pointer"/>
      </div>
      <SummaryModal

    open={showSummary}

    summary={summary}

    loading={loading}

    onClose={() => setShowSummary(false)}

    onRegenerate={regenerateSummary}

/>
<ToneRewrite

    open={showToneModal}

    onClose={()=>setShowToneModal(false)}

    onSelect={handleToneSelect}

/>

    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="" />

      <p className="text-lg font-medium text-white">
        Chat anytime, anywhere
      </p>


    </div>

    
  );
};

export default ChatContainer;