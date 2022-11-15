import Mysql from "mysql";
import DatabaseModel from "./lib/database.model";

class WallModel extends DatabaseModel{

    /* Create message data in the database */
    createMessage = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let create_message_query = Mysql.format(`
                INSERT INTO messages(user_id, message, created_at, updated_at)
                VALUES(?, ?, NOW(), NOW());
            `, [params.user_id, params.message]);
            let create_message = await this.executeQuery(create_message_query)

            response_data.status = !!create_message.affectedRows;
            response_data.result = (response_data.status) ? { message_id: create_message.insertId } : { };
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to fetch user information.";
        }

        return response_data;
    }

    /* Fetch all posts(messages and comments) to be displayed in the wall page */
    fetchAllPosts = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let fetch_all_posts_query = Mysql.format(`
                SELECT messages.id, messages.message AS content, DATE_FORMAT(messages.created_at, '%b %e, %Y at %T') AS posted_date,
                    users.id AS user_id, CONCAT_WS(' ', users.first_name, users.last_name) AS name, comments.message_comments AS comments
                FROM messages
                LEFT JOIN (
                    SELECT comments.message_id,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', comments.id, 
                                'content', comments.comment, 
                                'posted_date', DATE_FORMAT(comments.created_at, '%b %e, %Y at %T'),
                                'user_id', users.id,
                                'name', CONCAT_WS(' ', users.first_name, users.last_name)
                            )
                        ) AS message_comments
                    FROM comments
                    INNER JOIN users ON users.id = comments.user_id
                    GROUP BY comments.message_id
                ) AS comments ON comments.message_id = messages.id
                INNER JOIN users ON users.id = messages.user_id
                ORDER BY messages.created_at DESC
            `, []);
            let all_posts = await this.executeQuery(fetch_all_posts_query)

            response_data.status = !!all_posts.length;
            response_data.result = (response_data.status) ? all_posts : [];
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to fetch user information.";
        }

        return response_data;
    }

    /* Create comment data in the database */
    createComment = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let create_comment_query = Mysql.format(`
                INSERT INTO comments(user_id, message_id, comment, created_at, updated_at)
                VALUES(?, ?, ?, NOW(), NOW());
            `, [params.user_id, params.message_id, params.comment]);
            let create_comment = await this.executeQuery(create_comment_query)

            response_data.status = !!create_comment.affectedRows;
            response_data.result = (response_data.status) ? { comment_id: create_comment.insertId, message_id: params.message_id } : { };
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to fetch user information.";
        }

        return response_data;
    }

    /* Remove message or comment data in the database */
    deletePost = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let delete_post_query = Mysql.format(`
                DELETE FROM ${params.post_type}
                WHERE user_id = ? AND id = ?;
            `, [params.user_id, params.id]);
            let delete_post = await this.executeQuery(delete_post_query)

            response_data.status = !!delete_post.affectedRows;
            response_data.result = (response_data.status) ? { post_id: params.id, post_type: params.post_type } : { };
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to fetch user information.";
        }

        return response_data;
    }

    /* Fetch message/comment data in the database by id */
    fetchPostData = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let fetch_post_data_query = Mysql.format(`
                SELECT ${params.post_type}.id, ${(params.post_type === "messages") ? "message" : "comment"} AS content,
                    DATE_FORMAT(${params.post_type}.created_at, '%b %e, %Y at %T') AS posted_date,
                    users.id AS user_id, CONCAT_WS(' ', users.first_name, users.last_name) AS name
                FROM ${params.post_type}
                INNER JOIN users ON users.id = ${params.post_type}.user_id
                WHERE ${params.post_type}.id = ?;
            `, [params.id]);
            let post_data = await this.executeQuery(fetch_post_data_query)

            response_data.status = !!post_data.length;
            response_data.result = (response_data.status) ? post_data : [];
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to fetch user information.";
        }

        return response_data;
    }
}

export default WallModel;