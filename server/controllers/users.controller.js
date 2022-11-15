import { validateFields } from "../helpers/global.helper";
import UsersModel from "../models/users.model";

class UserController{
    constructor(){}

    /* Display the login or signup form */
    homepage = async (req, res) => {
        res.render("homepage");
    }

    /* Process the user signup */
    register = async (req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let check_fields = validateFields(["first_name", "last_name", "email", "password", "confirm_password"], [], req);

            if(check_fields.status){
                let usersModel = new UsersModel();
                response_data = await usersModel.register(check_fields.result);

                if(response_data.status){
                    response_data = response_data;

                    /* Save user id and first name in the user session. */
                    req.session.user = {
                        user_id: response_data.result.user_id,
                        first_name: response_data.result.first_name
                    }
                    req.session.save();
                }
            }
            else{
                response_data = check_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error while processing signup data";
        }

        res.json(response_data);
    }

    /* Process the user login */
    login = async (req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let check_fields = validateFields(["email", "password"], [], req);

            if(check_fields.status){
                let usersModel = new UsersModel();  
                let process_login = await usersModel.login(check_fields.result);
                
                if(process_login.status){
                    response_data = process_login;

                    /* Save user id and first name in the user session. */
                    req.session.user = {
                        user_id: process_login.result.user_id,
                        first_name: process_login.result.first_name
                    }
                    req.session.save();
                }
            }
            else{
                response_data = check_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error while processing login data";
        }

        res.json(response_data);
    }

    logout = async (req, res) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let check_fields = validateFields(["user_id"], [], req);

            if(check_fields.status && check_fields.result.user_id === req.session.user.user_id){
                req.session.destroy();
                response_data.status = true;
            }
            else{
                response_data = check_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error while processing logout data";
        }

        res.json(response_data);
    }
}

export default(function user(req, res){
    return new UserController(req, res);
})();