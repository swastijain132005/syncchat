import {createContext,useContext,useState} from "react";

import {useAuth} from "./Authcontext";

const AIContext=createContext();

export const AIProvider=({children})=>{

const {axios}=useAuth();

const [loading,setLoading]=useState(false);

const getReplies=async(message)=>{

try{

setLoading(true);

    console.log("Sending to AI:", message);


const {data}=await axios.post(

"/api/ai/smart-replies",

{

message

}

);

return data.replies;

}

catch(error){

console.log(error);

return [];

}

finally{

setLoading(false);

}

};

return(

<AIContext.Provider

value={{

getReplies,

loading

}}

>

{children}

</AIContext.Provider>

);

};

export const useAI=()=>useContext(AIContext);