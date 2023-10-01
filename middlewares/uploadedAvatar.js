import Jimp from "jimp";

const uploadedAvatar = async (req, res, next) => {
  try {
    const { path } = req.file;
    const image = await Jimp.read(path);
    await image.resize(250, 250).write(path);
    next();
  } catch (error) {
    console.log("Some trouble", error);
  }
};
export default uploadedAvatar;
