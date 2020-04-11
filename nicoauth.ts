/**
 * @fileoverview Class implementing the NiC's OAuth API authorization scheme
 * @author Joey Whelan <joey.whelan@gmail.com>
 */
import btoa from 'btoa';
import fetch from 'node-fetch';
import {Authenticator} from './authenticator';

export enum GRANT {PASSWORD, CLIENT};

export class Credentials {
    username:string;
    password:string;

    constructor(username:string, password:string) {
        this.username = username;
        this.password = password;
    }
};

export class NicOAuth implements Authenticator {
    private key:string;
    private grant:GRANT;
    private tokenURL:string;
    private credentials:Credentials | undefined;

    constructor (app:string, vendor:string, secret:string, grant:GRANT, tokenURL:string, credentials?:Credentials) {
        this.key = btoa(app + '@' + vendor + ':' + secret);
        this.grant = grant;
        this.tokenURL = tokenURL;
        this.credentials = credentials;
    }

    async getToken():Promise<string> {
        let body;
        const username = this.credentials ? this.credentials.username : '';
        const password = this.credentials ? this.credentials.password: '';

        switch (this.grant) {
            case GRANT.CLIENT : {
                body = {
                    'grant_type' : 'client_credentials'
                };
                break;
            };
            case GRANT.PASSWORD : {
                body = {
                    'grant_type' : 'password',
                    'username' : username,  
                    'password' : password
                }
                break;
            };
            default : {
                throw new Error('unknown grant type');
            }
        };

        const response = await fetch(this.tokenURL, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json', 
                'Authorization' : 'basic ' + this.key
            },
            body: JSON.stringify(body)
        });
    
        if (response.ok) {
            const json = await response.json();
            return json.access_token;
        }
        else {
            throw new Error(`response status: ${response.status} ${response.statusText}`);
        }
    }
}