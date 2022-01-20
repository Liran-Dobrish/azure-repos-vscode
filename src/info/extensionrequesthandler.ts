/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { IHttpClient, IHttpClientResponse, IRequestHandler, IRequestInfo } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import { getBasicHandler } from "azure-devops-node-api/WebApi";
import { getNtlmHandler } from "azure-devops-node-api/WebApi";
import { Constants } from "../helpers/constants";
import { UserAgentProvider } from "../helpers/useragentprovider";

// This class creates an IRequestHandler so we can send our own custom user-agent string
export class ExtensionRequestHandler implements IRequestHandler {
    private _domain?: string;
    private _username: string;
    private _password: string;
    private _workstation?: string;
    private _credentialHandler: IRequestHandler;

    constructor(accessToken: string);
    constructor(username: string, password?: string, domain?: string, workstation?: string);

    constructor(username: string, password?: string, domain?: string, workstation?: string) {
        if (username !== undefined && password !== undefined) {
            // NTLM (we don't support Basic auth)
            this._username = username;
            this._password = password;
            this._domain = domain;
            this._workstation = workstation;
            this._credentialHandler = getNtlmHandler(this._username, this._password, this._domain, this._workstation);
        } else {
            // Personal Access Token
            this._username = Constants.OAuth;
            this._password = username; //use username since it is first argument to constructor
            this._credentialHandler = getBasicHandler(this._username, this._password);
        }
    }

    public get Domain(): string {
        if (this._domain) {
            return this._domain;
        }
        return "";
    }

    public get Username(): string {
        return this._username;
    }

    public get Password(): string {
        return this._password;
    }

    public get Workstation(): string {
        if (this._workstation) {
            return this._workstation;
        }
        return "";
    }

    // Below are the IRequestHandler implementation/overrides
    public prepareRequest(options: any): void {
        this._credentialHandler.prepareRequest(options);

        // Get user agent string from the UserAgentProvider (Example: VSTSVSCode/1.115.1 (VSCode/10.1.0; Windows_NT/10.0.10586; Node/6.5.0))
        const userAgent: string = UserAgentProvider.UserAgent;
        options.headers["User-Agent"] = userAgent;
    }

    public canHandleAuthentication(res: IHttpClientResponse): boolean {
        return this._credentialHandler.canHandleAuthentication(res);
    }

    public handleAuthentication(httpClient: IHttpClient, requestInfo: IRequestInfo, objs: any): Promise<IHttpClientResponse> {
        return this._credentialHandler.handleAuthentication(httpClient, requestInfo, objs);
    }
}
