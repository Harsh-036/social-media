const router = require('express').Router();
const postsController  = require('../controller/postsController');
const requireUser = require('../middleware/requireUser')

// router.get('/all', requireUser, postsController.getAllPostsController)
router.post('/', requireUser, postsController.createPostController)
router.post('/like', requireUser, postsController.likeAndUnlikePost)
router.put('/', requireUser, postsController.updatePostController)
router.delete('/', requireUser, postsController.deletePost)

module.exports = router;
