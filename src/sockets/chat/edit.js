import Message from "../../models/messageModel.js";

export default  function editHandlers(io,socket){
        socket.on("editMessage",async({ messageId, newContent, userId })=>{
            try{
            const message = await Message.findById(messageId);
            message.content=newContent;
            await message.save();
              io.to(userId).emit("messageEdited", { messageId,newContent });
            }catch(err){
                console.log(err);
            }
        })
      
    

}