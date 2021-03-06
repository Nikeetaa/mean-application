const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  //protocol = http or https
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save()
  .then(response => {
    res.status(201).json({
      message: 'Posts Added successfully!!',
      post: {
        ...response, //next-gen javascript feature with ...(spread operator)
        id: response._id // overide the property
      }
    });
  })
  .catch(error => {
    res.status(401).json({
      message: "Post not created!!"
    })
  });
};

exports.getAll = (req, res, next) => {
  const pageSize = +req.query.pagesize; //+ to convert string to number
  const currentPage = +req.query.page;
  let postQuery = Post.find();
  let fetchedPost;
  if(pageSize && currentPage) {
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
    //skip:not all skip the first n records
    //eg on page 3 and pagesize = 10 then skip 10 * (3 -1) = 20
    //skip first 20 records
    //limit: limits the amount of documents to be returned
  }
  postQuery.find()
    .then(documents => {
      fetchedPost = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!!',
        posts: fetchedPost,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(401).json({
        message: "Fetching posts failed!!"
      })
    });
};

exports.getOne = (req, res, next) => {
  Post.findById(req.params.id)
  .then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: "Post not found!!"})
    }
  })
  .catch(error => {
    res.status(401).json({
      message: "Fetching post failed!!"
    })
  });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });

  Post.updateOne({_id: req.params.id, creator: req.userData.userId }, post)
  .then(result => {
    if(result.n > 0) {
      res.status(200).json({
        message: 'Posts Updated successfully!!'
      });
    } else {
      res.status(401).json({
        message: 'UnAuthorized User!!'
      });
    }
  })
  .catch(error => {
    res.status(401).json({
      message: "Post not updated!!"
    })
  });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId })
  .then(result => {
    if(result.n > 0) {
      res.status(201).json({
        message: 'Posts Deleted successfully!!'
      });
    } else {
      res.status(201).json({
        message: 'UnAuthorized User!!'
      });
    }
  })
  .catch(error => {
    res.status(401).json({
      message: "Deleting posts failed!!"
    })
  });
};
