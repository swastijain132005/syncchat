import {createContext,useContext,useState} from "react";
import {toast} from "react-hot-toast";

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


const getConversationSummary = async (messages) => {

        try {

            setLoading(true);

            const { data } = await axios.post(
                "/api/ai/summary",
                {
                    messages,
                }
            );

            if (data.success) {

                return data.summary;

            }

            return "";

        } catch (error) {

            console.log(error);

            toast.error("Failed to summarize conversation");

            return "";

        } finally {

            setLoading(false);

        }

    };

    const rewriteMessage = async (message, tone) => {
    try {

        setLoading(true);

        const { data } = await axios.post(
            "/api/ai/toneRewrite",
            {
                message,
                tone,
            }
        );

        if (data.success) {
            return data.rewritten;
        }

        return "";

    } catch (error) {

        console.log(error);

        toast.error("Failed to rewrite message.");

        return "";

    } finally {

        setLoading(false);

    }
};

const translate = async (message, language) => {

    try {

        setLoading(true);

        const { data } = await axios.post(

            "/api/ai/translate",

            {

                message,

                language,

            }

        );

        return data.translated;

    }

    finally {

        setLoading(false);

    }

};


return(

<AIContext.Provider

value={{

getReplies,
getConversationSummary,
rewriteMessage,
translate,

loading

}}

>

{children}

</AIContext.Provider>

);

};




export const useAI=()=>useContext(AIContext);