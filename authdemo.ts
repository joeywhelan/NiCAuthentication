/**
 * @fileoverview Demo of NiC's authentication schemes
 * @author Joey Whelan <joey.whelan@gmail.com>
 */

import {GRANT, Credentials, NicOAuth} from './nicoauth';
import {NicAccess} from './nicaccess';
import dotenv from 'dotenv';

/**
 * Function that clears out existing rules on a twitter realtime filter
 * @return {promise} void.  no return value
 * @throws {Error} propagates HTTP status errors or node-fetch exceptions
 */
async function demo():Promise<void> {
    dotenv.config();
    const app:any = process.env.NIC_APP;
    const vendor:any = process.env.NIC_VENDOR;
    const secret:any = process.env.NIC_SECRET;
    const username:any = process.env.NIC_USERNAME;
    const password:any = process.env.NIC_PASSWORD;
    const accessSecret:any = process.env.NIC_ACCESS_SECRET;
    const accessKey:any = process.env.NIC_ACCESS_KEY;
 
    
    let url:string =  'https://api.incontact.com/InContactAuthorizationServer/Token';
    const clientAuth = new NicOAuth(app, vendor, secret, GRANT.CLIENT, url);
    let token:string = await clientAuth.getToken();
    console.log(`client auth token: ${token}`);
    console.log('');

    const credentials = new Credentials(username, password);
    const passwordAuth = new NicOAuth(app, vendor, secret, GRANT.CLIENT, url, credentials);
    token = await passwordAuth.getToken();
    console.log(`password auth token: ${token}`);
    console.log('');

    url = 'https://na1.nice-incontact.com/authentication/v1/token/access-key';
    const nicAccess = new NicAccess(accessKey, accessSecret, url);
    token = await nicAccess.getToken();
    console.log(`access token: ${token}`);
}

demo();