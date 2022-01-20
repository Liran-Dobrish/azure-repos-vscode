/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import { ExtensionRequestHandler } from "./extensionrequesthandler";

export class CredentialInfo {
    private _credentialHandler?: ExtensionRequestHandler;

    constructor(accessToken: string);
    constructor(username: string, password?: string);
    constructor(username: string, password?: string, domain?: string, workstation?: string);

    constructor(username: string, password?: string, domain?: string, workstation?: string) {
        if (username !== undefined && password !== undefined) {
            // NTLM (we don't support Basic auth)
            this._credentialHandler = new ExtensionRequestHandler(username, password, domain, workstation);
        } else {
            // Personal Access Token
            // Use username (really, accessToken) since it is first argument to constructor
            this._credentialHandler = new ExtensionRequestHandler(username);
        }
    }

    public get CredentialHandler(): IRequestHandler | undefined {
        if (this._credentialHandler) {
            return this._credentialHandler;
        }
        return undefined;
    }

    public set CredentialHandler(handler: IRequestHandler | undefined) {
        this._credentialHandler = <ExtensionRequestHandler>handler;
    }

    public get Domain(): string | undefined {
        return this._credentialHandler?.Domain;
    }

    public get Username(): string | undefined {
        return this._credentialHandler?.Username;
    }

    public get Password(): string | undefined {
        return this._credentialHandler?.Password;
    }

    public get Workstation(): string | undefined {
        return this._credentialHandler?.Workstation;
    }

}
