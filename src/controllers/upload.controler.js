

export const uploadOnCloudinary = async(req, res)=>{
    try{
         if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const { path,mimetype, originalname } = req.file;
  console.log("print req",req.file);
   let type=null;
    const isVideo = mimetype.startsWith("video/");
    if(isVideo){
      type="video"
    }else{
      type="image"
    }
  res.status(200).json({
    message: "File uploaded successfully!",
    fileType: type, // 'image' or 'video'
    url: path, // Cloudinary URL
    originalName: originalname,
  });

    }catch(err){
         console.log(err.message);
      return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Something Went Wrong",
    }); 
    }
}