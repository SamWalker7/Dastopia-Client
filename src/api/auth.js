import { CognitoUserPool, CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";

import { cognitoConfig } from "../cognitoConfig";

const userPool = new CognitoUserPool({
    UserPoolId: cognitoConfig.UserPoolId,
    ClientId: cognitoConfig.ClientId
})


export function signup(email, firstName, lastName, phoneNumber, password){

  
    return new Promise((resolve, reject) => {
        userPool.signUp(
            email,
            password,
            [{Name: "email", Value: email}, {Name: "given_name", Value: firstName}, {Name: "family_name", Value: lastName}, {Name:"phone_number", Value:`+251${phoneNumber}`}],
            null, 
            (err, result) => {
                if(err){
                    console.log("error while sign up", err)
                    reject(err);
                    return;
                }

                console.log("sucess", result)
                resolve(result.user)
            }
        )
    })
}