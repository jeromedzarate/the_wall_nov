import { validateFields }   from "../helpers/global.helper";
import WallModel            from "../models/walls.model";

import Ejs from "ejs";
import Path from "path"

class WallController{
    constructor(){}

    /* Display the wall messages and comments*/
    wallpage = async (req, res) => {
        if(req.session?.user?.user_id){
            let wallModel = new WallModel();
            let all_posts = await wallModel.fetchAllPosts();

            res.render("wallpage", { DATA: { user_data: req.session.user, posts: all_posts.result }});
        }
        else{
            res.redirect("/");
        }
    }

    /* Process the creating of message */
    createMessage = async (req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            if(!req.session?.user?.user_id){
                throw Error("Please Login!");
            }

            let check_fields = validateFields(["message"], [], req);

            if(check_fields.status){
                let wallModel = new WallModel();
                response_data = await wallModel.createMessage({ ...check_fields.result, user_id: req.session.user.user_id });

                if(response_data.status){
                    let {result: [fetch_post_data]} = await wallModel.fetchPostData({id: response_data.result.message_id, post_type: "messages" });
                    
                    response_data.html = await Ejs.renderFile(Path.join(__dirname, "../../views/partials/post.partial.ejs"), {
                        posts: { ...fetch_post_data, post_type: "message"}
                    },{async: true});
                }
            }
            else{
                response_data = check_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error while processing create message data";
        }

        res.json(response_data);
    }

    /* Process the creating of comment */
    createComment = async (req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            if(!req.session?.user?.user_id){
                throw Error("Please Login!");
            }

            let check_fields = validateFields(["comment", "message_id"], [], req);

            if(check_fields.status){
                let wallModel = new WallModel();
                response_data = await wallModel.createComment({ ...check_fields.result, user_id: req.session.user.user_id });

                if(response_data.status){
                    let {result: [fetch_post_data]} = await wallModel.fetchPostData({id: response_data.result.comment_id, post_type: "comments" });
                    
                    response_data.html = await Ejs.renderFile(Path.join(__dirname, "../../views/partials/post.partial.ejs"), {
                        posts: { ...fetch_post_data, post_type: "comment"}
                    },{async: true});
                }
            }
            else{
                response_data = check_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error while processing create message data";
        }

        res.json(response_data);
    }

    /* Process the deleting of post(message or comment) */
    deletePost = async (req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            if(!req.session?.user?.user_id){
                throw Error("Please Login!");
            }

            let check_fields = validateFields(["id", "post_type"], [], req);

            if(check_fields.status){
                let wallModel = new WallModel();
                response_data = await wallModel.deletePost({ ...check_fields.result, user_id: req.session.user.user_id });
            }
            else{
                response_data = check_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error while processing create message data";
        }

        res.json(response_data);
    }
}

export default(function user(req, res){
    return new WallController(req, res);
})();