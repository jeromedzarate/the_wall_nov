class UserHelper{
    constructor(){}

    checkUserParameters = async(params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let error_fields = [];
            let password_value = "";

            Object.entries(params).forEach(([field_name, field_value]) =>{
                const name_format = /[@%^&!"\\\*\.,\-\:?\/\'=`{}()+_\]\|\[\><~;$#0-9]/;
                const email_format = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.){1,2}[a-zA-Z]{2,}))$/;

                /* Check if first name and last name is in valid format. */
                if(["first_name", "last_name"].includes(field_name) && name_format.test(field_value)){
                    error_fields.push(field_name);
                }

                /* Check if email is in valid format. */
                if(field_name === "email" && !email_format.test(field_value)){
                    error_fields.push(field_name);
                }

                if(field_name === "password"){
                    password_value = field_value;

                    /* Check if password is atleast 8 characters length */
                    if(field_value.length < 8){
                        error_fields.push(field_name);
                    }
                }

                /* Check if passwords are match */
                if(field_name === "confirm_password" && password_value !== field_value){
                    error_fields.push(field_name);
                }
            });

            response_data.status = !error_fields.length;
            response_data.result = (!response_data.status) ? error_fields : [];
            response_data.message = (!response_data.status) ? `Validating parameters failed.\n\nPlease check the following fields: ${ error_fields.join(",") }` : ""
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error while validating signup/signin parameters.";
        }

        return response_data;
    }
}

module.exports = UserHelper;