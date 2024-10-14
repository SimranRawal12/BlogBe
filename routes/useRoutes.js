const router = require("express").Router();
const { Op } = require("sequelize");
const db = require("../db/connection");
const multer = require("multer");

router.get("/GetBlog", async (req, res) => {
  try {
    const getData = await db.Admin.findAll({
      where: {
        category: {
          [Op.like]: `${req.query.category}%`
        }
      },
      order: [["createdAt", "DESC"]],
    });
    res.json(getData);
  } catch (error) {
    console.log(error);
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    console.log(file.originalname);
    let ext = file.originalname.substring(
      file.originalname.lastIndexOf("."),
      file.originalname.length
    );
    return cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage });

router.get("/Description/:isId", async (req, res) => {
  const { Id } = req.params;
  try {
    const getDescription = await db.Admin.findOne({ where: { id: isId } });
    res.json(getDescription);
  } catch (error) {
    console.log(error);
  }
});


// router.delete("/DeleteBlog/:id",async (req,res)=>{
//   const Id = req?.params?.id;
//   try {
//     const post = await db.Admin.findOne({ where: { id: Id } });
//     console.log(post)
//     if (!post) {
//       return res.status(404).json({ error: 'Post not found' });
//     }
//     await post.destroy();
//     res.status(204).end();
//   } catch (error) {
//     console.error('Error deleting post:', error);
//     res.status(500).json({ error: 'An error occurred while deleting the post' });
//   }
// })

router.delete("/DeleteBlog/:id", async (req, res) => {
  const Id = req?.params?.id;
  try {
    const post = await db.Admin.findOne({ where: { id: Id } });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await post.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'An error occurred while deleting the post' });
  }
});

router.get("/recent-blogs",async (req,res)=>{
  try {
    const recentBlogs = await db.Admin.findAll({
      limit: 3,
      order: [['createdAt', 'DESC']],
    });
    res.json(recentBlogs);
  } catch (error) {
    console.error('Error fetching recent blogs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.put("/Update/:id",async (req,res)=>{
  const {id}= req.params;
  const {title,description,category}=req.body;
  try {
    const blog = await db.Admin.findOne({where:{id}});
    if(!blog){
      return res.status(404).json({error:'Post Not found'});
    }
    blog.title= title;
    blog.description=description;
    blog.category=category;
    await blog.save();
    res.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.get("/MyBlogs/:Id", async (req, res) => {
  const { Id } = req.params;
  try {
    const getMyPosts = await db.User.findOne({
      where: { id: Id },
      include: [
        {
          model: db.Admin,
          as: "userBlogs",
        },
      ],
    });
    res.json(getMyPosts);
  } catch (error) {
    console.log(Error);
  }
});

router.post("/PostBlog", upload.single("image"), async (req, res) => {
  const { title, description, category, userId } = req.body;
  try {
    const createPost = await db.Admin.create({
      title,
      category,
      description,
      image: req.file.filename,
      userId,
    });
    // Respond with the created post data
    res.status(200).json(createPost);
  } catch (error) {
    // If there's an error, respond with an error message
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
