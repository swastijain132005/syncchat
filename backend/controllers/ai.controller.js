import { generateSmartReplies ,generateSummary} from "../services/ai.service.js";

export const smartReplies = async(req,res)=>{

    console.log("AI Controller Hit");

    console.log(req.body);

try{

const {message}=req.body;

const replies=await generateSmartReplies(message);

res.json({

success:true,

replies

});

}

catch(error){

console.log(error);

res.status(500).json({

success:false,

message:error.message

});

}

}


export const conversationSummary = async (req, res) => {

    try {

        const { messages } = req.body;

        if (!messages || messages.length === 0) {

            return res.status(400).json({

                success: false,

                message: "No messages found."

            });

        }

        const summary = await generateSummary(messages);

        return res.json({

            success: true,

            summary,

        });

    }

    catch (error) {

        console.error("Summary Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message,

        });

    }
};