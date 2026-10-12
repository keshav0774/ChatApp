import openRouter from "../config/opneRouter.js";


//send message to the model and return its reply

export const generateAIResponse = async({model , messages})=>{

   const completion = await openRouter.chat.send({
        chatRequest:{
            model,
            messages
        },
    });
    
    const aiReply = completion.choices[0]?.message?.content; 

    if(!aiReply){
        throw new Error("Ai response is empty");
    }
    

    const promptTokens = completion.usage?.promptTokens || 0;

    const completionTokens = completion.usage?.completionTokens || 0;

    return {
        aiReply,
        usage:{
            promptTokens, //input token 
            completionTokens, // output token 
            totalTokens : promptTokens + completionTokens // totalToken = input + output
        },
    };
};
