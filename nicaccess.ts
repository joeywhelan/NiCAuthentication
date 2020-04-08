/**
 * @fileoverview Class implementing the NiC's access key api authorization scheme
 * @author Joey Whelan <joey.whelan@gmail.com>
 */
import btoa from 'btoa';
import fetch from 'node-fetch';
import {Authenticator} from './authenticator';

export class NicAccess implements Authenticator {
    private key:string;
    private secret:string;
    private url:string;
    
    constructor (key:string, secret:string, url:string) {
        this.key = key;
        this.secret = secret;
        this.url = url;
    }

    async getToken():Promise<string> {
        const body:object = {
            accessKeyId: this.key,
            accessKeySecret: this.secret
        } 
        const response = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(body)
        });
    
        if (response.ok) {
            const json = await response.json();
            return json.access_token;
        }
        else {
            throw new Error(`getToken() response status: ${response.status} ${response.statusText}`);
        }
    
    }
}