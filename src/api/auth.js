import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

import { cognitoConfig } from "../cognitoConfig";
import { url } from ".";
import axios from "axios";

const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.UserPoolId,
  ClientId: cognitoConfig.ClientId,
});

export function signup( email, firstName, lastName, phoneNumber, password) {
  return new Promise((resolve, reject) => {
    userPool.signUp(
      `+${phoneNumber}`,
      password,
      [
        { Name: "email", Value: email },
        { Name: "given_name", Value: firstName },
        { Name: "family_name", Value: lastName },
        { Name: "phone_number", Value: `+${phoneNumber}` },
      ],
      null,
      (err, result) => {
        if (err) {
          console.log("error while sign up", err);
          reject(err);
          return;
        }
        resolve(result.user);
      }
    );
  });
}

export function signin(signinOption, password) {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: `+${signinOption}`,
      Password: password,
    });

    const cognitoUser = new CognitoUser({
      Username: `+${signinOption}`,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        
        reject(err);
        return;
      },
    });
  });
}

export function confirmSignup(phone, code) {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: `+${phone}`,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(result);
    });
  });
}

export function signout() {
  const cognitoUser = userPool.getCurrentUser()
  if (cognitoUser) {
    cognitoUser.signOut()
  }
}

export function getCurrentUser() {  
    return new Promise((resolve, reject) => {
        const cognitoUser = userPool.getCurrentUser()
    
        if (!cognitoUser) {
          reject(new Error("No user found"))
          return
        }
    
        cognitoUser.getSession((err, session) => {
          if (err) {
            reject(err)
            return
          }
          cognitoUser.getUserAttributes((err, attributes) => {
            if (err) {
              reject(err)
              return
            }
            const userData = attributes.reduce((acc, attribute) => {
              acc[attribute.Name] = attribute.Value
              return acc
            }, {})
    
            resolve({ ...userData, username: cognitoUser.username })
          })
        })
      })
    
}

export function getSession() {}
