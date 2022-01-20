/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { TeamProject, TeamProjectCollection } from "azure-devops-node-api/interfaces/CoreInterfaces";
import { WebApi } from "azure-devops-node-api/WebApi";
import { ICoreApi } from "azure-devops-node-api/CoreApi";
import { CredentialManager } from "../helpers/credentialmanager";

export class CoreApiService {
    private _coreApi: ICoreApi | undefined;

    constructor(remoteUrl: string) {
        new WebApi(remoteUrl, CredentialManager.GetCredentialHandler()).getCoreApi().then((core: ICoreApi) => {
            this._coreApi = core;
        });
    }

    //Get the
    public async GetProjectCollection(collectionName: string): Promise<TeamProjectCollection> {
        return await this._coreApi!.getProjectCollection(collectionName);
    }

    //Get the
    public async GetTeamProject(projectName: string): Promise<TeamProject> {
        return await this._coreApi!.getProject(projectName, false, false);
    }

}
