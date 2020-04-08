/**
 * @fileoverview Interface for fetching a NiC authentication token
 * @author Joey Whelan <joey.whelan@gmail.com>
 */
export interface Authenticator {
    getToken():Promise<string>;
};