/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { IRepositoryContext, RepositoryType } from "./repositorycontext";
import { RepoUtils } from "../helpers/repoutils";
import { Logger } from "../helpers/logger";
import { ISettings } from "../helpers/settings";

export class ExternalContext implements IRepositoryContext {
    private _folder: string | undefined;
    private _remoteUrl: string | undefined = "";
    private _isSsh: boolean = false;
    private _isTeamServicesUrl: boolean = false;
    private _isTeamFoundationServer: boolean = false;
    private _teamProjectName: string | undefined = "";

    constructor(rootPath: string | undefined) {
        //The passed in path is the workspace.rootPath (which could be a sub-folder)
        this._folder = rootPath;
    }

    public dispose() {
        //nothing to do
    }

    //Need to call tf.cmd to get TFVC information (and constructors can't be async)
    public async Initialize(settings: ISettings): Promise<boolean> {
        Logger.LogDebug(`Looking for an External Context at ${this._folder}`);
        if (!settings.RemoteUrl || !settings.TeamProject) {
            Logger.LogDebug(`No External Context at ${this._folder}`);
            return false;
        }
        this._remoteUrl = settings.RemoteUrl;
        this._isTeamServicesUrl = RepoUtils.IsTeamFoundationServicesRepo(this._remoteUrl);
        this._isTeamFoundationServer = RepoUtils.IsTeamFoundationServerRepo(this._remoteUrl);
        this._teamProjectName = settings.TeamProject;
        Logger.LogDebug(`Found an External Context at ${this._folder}`);
        return true;
    }

    // Tfvc implementation
    public get TeamProjectName(): string | undefined {
        if (this._teamProjectName !== "") {
            return this._teamProjectName;
        }
        return undefined;
    }

    // Git implementation
    public get CurrentBranch(): string | undefined {
        return undefined;
    }
    public get CurrentRef(): string | undefined {
        return undefined;
    }

    // IRepositoryContext implementation
    public get RepoFolder(): string | undefined {
        return this._folder;
    }
    public get IsSsh(): boolean {
        return this._isSsh;
    }
    public get IsTeamFoundation(): boolean {
        return this._isTeamServicesUrl || this._isTeamFoundationServer;
    }
    public get IsTeamServices(): boolean {
        return this._isTeamServicesUrl;
    }
    public get RemoteUrl(): string | undefined {
        return (this._remoteUrl !== "" ? this._remoteUrl : undefined);
    }
    public get RepositoryParentFolder(): string | undefined {
        return undefined;
    }
    public get Type(): RepositoryType {
        return RepositoryType.EXTERNAL;
    }
}
