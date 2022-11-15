$(document).ready(function(){
    $("body")
        .on("submit", "#create_message_form", createMessage)
        .on("submit", ".create_comment_form", createComment)
        .on("click", ".delete_post_btn", processDeletePostData)
        .on("submit", "#delete_post_form", deletePost)
        .on("submit", "#logout_form", logoutUser)
});

/* Submit the form for create messages */
function createMessage(){
    let create_message_form = $(this);

    if(parseInt(create_message_form.attr("data-is_processing")) === 0){
        create_message_form.attr("data-is_processing", 1);

        $.post(create_message_form.attr("action"), create_message_form.serialize(), function(create_message_response){
            if(create_message_response.status){
                $(".messages_container").prepend(create_message_response.html);
            }
            else{
                alert(create_message_response.message);
            }
        });

        create_message_form.attr("data-is_processing", 0)
    }

    return false;
}

/* Submit the form for create comments */
function createComment(){
    let create_comment_form = $(this);

    if(parseInt(create_comment_form.attr("data-is_processing")) === 0){
        create_comment_form.attr("data-is_processing", 1);

        $.post(create_comment_form.attr("action"), create_comment_form.serialize(), function(create_comment_response){
            if(create_comment_response.status){
                let messages_container = $(`.message_${create_comment_response.result.message_id}`);

                messages_container.find(".comments_container").append(create_comment_response.html);
            }
            else{
                alert(create_comment_response.message);
            }
        });

        create_comment_form.attr("data-is_processing", 0)
    }

    return false;
}

/* Process the data needed in deleting a message or comment */
function processDeletePostData(){
    let delete_btn = $(this);
    let delete_post_form = $("#delete_post_form");

    delete_post_form.find("#post_id").val(delete_btn.parents("div").attr("data-post_id"));
    delete_post_form.find("#post_type").val(delete_btn.parents("div").attr("data-post_type"));

    delete_post_form.submit();
}

/* Submit the form for deleting message/comment */
function deletePost(){
    let delete_post_form = $(this);

    if(parseInt(delete_post_form.attr("data-is_processing")) === 0){
        delete_post_form.attr("data-is_processing", 1);

        $.post(delete_post_form.attr("action"), delete_post_form.serialize(), function(delete_post_response){
            if(delete_post_response.status){
                $(`.${(delete_post_response.result.post_type === "messages") ? "message" : "comment"}_${delete_post_response.result.post_id}`).remove();
            }
            else{
                alert(delete_post_response.message);
            }
        });

        delete_post_form.attr("data-is_processing", 0)
    }

    return false;
}

/* Submit the form user logout */
function logoutUser(){
    let logout_form = $(this);

    if(parseInt(logout_form.attr("data-is_processing")) === 0){
        logout_form.attr("data-is_processing", 1);

        $.post(logout_form.attr("action"), logout_form.serialize(), function(logout_response){
            if(logout_response.status){
                window.location.href = "/";
            }
            else{
                alert(logout_response.message);
            }
        });

        logout_form.attr("data-is_processing", 0)
    }

    return false;
}