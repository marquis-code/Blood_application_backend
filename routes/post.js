const express = require('express');
const postRouter = express.Router();
const BlogPost = require('../models/Post');
const authenticateJwt = require('../middlewares/verifyJwt')

postRouter.get('/', async(req, res) => {
    try {
        const posts = await BlogPost.find();
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({errorMessage : 'Something went wrong'})
    }
})

postRouter.get('/:postId', async(req, res) => {
    const postId = req.params.postId;
    try {
        const post = await BlogPost.findOne({postId});
        if(!post){ return res.status(400).json({errorMessage : 'Post with is was not found'})}

        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
    }
})

postRouter.post("/", async(req, res) => {
    const {title, subTitle, description, readingTime, tags} = req.body;
    try {
        //    tags = tags && tags.split(", ");
        //    tags = tags && tags.filter((eachTag) => eachTag.startsWith("#"));
         const post = await new BlogPost({
           title,
           subTitle,
           description,
           readingTime,
           tags
         });
         post.save();
         res.status(200).json({successMessage : 'New post was successfully created'})
        console.log(post)
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({errorMessage : 'Something went wrong'})
    }
});

postRouter.put("/:postId", async(req, res) => {
    const postId = req.params.postId;
     const {title, subTitle, description, readingTime, tags} = req.body;
     try {
        const post = await BlogPost.findOne({postId});
        if(!post){ 
           let newPost = await new BlogPost({title, subTitle, description, readingTime, tags});
           return res.status(200).json({newPost})
        }
        post.title = title
        post.subTitle = subTitle
        post.description = description
        post.readingTime = readingTime
        post.tags = tags
        await post.save();
        return res.status(200).json({successMessage : 'P0st was successfully updated'})
    } catch (error) {
        return res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
    }

});

postRouter.delete("/:postId", async(req, res) => {
   const postId = req.params.postId;
 try {
  const post = await BlogPost.deleteOne({postId}).exec();
  if(post.deletedCount === 0){
     return res.status(404).json({errorMessage : `Post With title ${post.title} does not Exist`});
  }else{
     res.status(200).json({successMessage : `Post With title ${post.title} Was Successfully Deleted`});
    }
 } catch (error) {
  res.status(500).json({errorMessage : 'Something went wrong, Please try again.'});
 }
});

module.exports = postRouter;