import Mysql from "mysql";
import Bycrpt  from "bcryptjs";

import DatabaseModel from "./lib/database.model";
import UserHelper from "../helpers/users.helpers";

class UsersModel extends DatabaseModel{

    /* Fetch user by email */
    fetchUserData = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let fetch_user_query = Mysql.format(`
                SELECT id, first_name, last_name, email, password FROM users WHERE email = ?;
            `, [params.email]);

            response_data.result = await this.executeQuery(fetch_user_query);
            response_data.status = response_data.result.length;
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to fetch user information.";
        }

        return response_data;
    }

    /* Process the user signup. */
    register = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Validate the signup parameter if in valid format. */
            let userHelper = new UserHelper();
            let validate_signup_params = await userHelper.checkUserParameters(params);

            if(validate_signup_params.status){
                let { first_name, last_name, email, password } = params;

                /* Check first if the email is already registered. */
                let get_user_data = await this.fetchUserData({ email });
    
                if(!get_user_data.status){
                    /* Encrypt the password  */
                    let encrypted_password = Bycrpt.hashSync(password, 10);
    
                    /* Insert user data into the database */
                    let create_user_query = Mysql.format(`
                        INSERT INTO users (first_name, last_name, email, password, created_at, updated_at)
                        VALUES(?, ?, ?, ?, NOW(), NOW())
                    `, [first_name, last_name, email, encrypted_password]);
                    let create_user = await this.executeQuery(create_user_query);
    
                    if(create_user.affectedRows){
                        response_data.status = true;
                        response_data.result = { user_id: create_user.insertId, first_name, redirect_url: "/wall" };
                    }
                    else{
                        response_data.error = "Encountered an error while saving user data into the database;";
                        response_data.message = "Failed to create user.";
                    }
                }
                else{
                    response_data.status = !get_user_data;
                    response_data.message = "Email is already registered.";
                }
            }
            else{
                response_data = validate_signup_params;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to process signup data";
        }

        return response_data;
    }

    /* Process the user login. */
    login = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            /* Validate the login parameter if in valid format. */
            let userHelper = new UserHelper();
            let validate_signup_params = await userHelper.checkUserParameters(params);

            if(validate_signup_params.status){
                /* Check first if the email is already registered. */
                let get_user_data = await this.fetchUserData({ email: params.email });
    
                if(get_user_data.status){
                    let [{ password, id: user_id, first_name }] = get_user_data.result
                    /* Check if password is match */
                    if(Bycrpt.compareSync(params.password, password)){
                        response_data.status = true;
                        response_data.result = { user_id, first_name, redirect_url: "/wall" };
                    }
                    else{
                        response_data.error = "Encountered an error while validating password.";
                        response_data.message = "Incorrect email or password.";
                    }
                }
                else{
                    response_data.status = !get_user_data;
                    response_data.message = "User does not exists.";
                }
            }
            else{
                response_data = validate_signup_params;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed to process login data";
        }

        return response_data;
    }
}

export default UsersModel;