/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import { CredentialInfo } from "../info/credentialinfo";
import { RepositoryInfo } from "../info/repositoryinfo";
import { UserInfo } from "../info/userinfo";

export class TeamServerContext {
    private _userInfo: UserInfo | undefined;
    private _repositoryInfo: RepositoryInfo | undefined;
    private _credentialHandler: IRequestHandler | undefined;
    private _credentialInfo: CredentialInfo | undefined;

    //The constructor simply parses the remoteUrl to determine if we're Team Services or Team Foundation Server.
    //Any additional information we can get from the url is also parsed.  Once we call the vsts/info api, we can
    //get the rest of the information that we need.
    constructor(remoteUrl: string | undefined) {
        if (remoteUrl === undefined) { return; }

        this._repositoryInfo = new RepositoryInfo(remoteUrl);
    }

    public get CredentialHandler(): IRequestHandler | undefined {
        return this._credentialHandler;
    }
    public set CredentialHandler(handler: IRequestHandler | undefined) {
        this._credentialHandler = handler;
    }
    public get RepoInfo(): RepositoryInfo | undefined {
        return this._repositoryInfo;
    }
    public set RepoInfo(info: RepositoryInfo | undefined) {
        this._repositoryInfo = info;
    }
    public get UserInfo(): UserInfo | undefined {
        return this._userInfo;
    }
    public set UserInfo(info: UserInfo | undefined) {
        this._userInfo = info;
    }
    public get CredentialInfo(): CredentialInfo | undefined {
        return this._credentialInfo;
    }
    public set CredentialInfo(info: CredentialInfo | undefined) {
        this._credentialInfo = info;
    }
}
