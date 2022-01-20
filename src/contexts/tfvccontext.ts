/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { IRepositoryContext, RepositoryType } from "./repositorycontext";
import { TfCommandLineRunner } from "../tfvc/tfcommandlinerunner";
import { TfvcRepository } from "../tfvc/tfvcrepository";
import { IWorkspace } from "../tfvc/interfaces";
import { RepoUtils } from "../helpers/repoutils";
import { Logger } from "../helpers/logger";

export class TfvcContext implements IRepositoryContext {
    private _tfvcFolder: string;
    private _gitParentFolder: string | undefined;
    private _tfvcRemoteUrl: string | undefined;
    private _isSsh: boolean = false;
    private _isTeamServicesUrl: boolean = false;
    private _isTeamFoundationServer: boolean = false;
    private _teamProjectName: string | undefined;
    private _repo: TfvcRepository | undefined;
    private _tfvcWorkspace: IWorkspace | undefined;

    constructor(rootPath: string) {
        this._tfvcFolder = rootPath;
    }

    //Need to call tf.cmd to get TFVC information (and constructors can't be async)
    public async Initialize(): Promise<boolean> {
        Logger.LogDebug(`Looking for TFVC repository at ${this._tfvcFolder}`);
        this._repo = TfCommandLineRunner.CreateRepository(undefined, this._tfvcFolder);
        //Ensure we have an appropriate ENU version of tf executable
        //The call will throw if we have tf configured properly but it isn't ENU
        await this._repo.CheckVersion();
        this._tfvcWorkspace = await this._repo.FindWorkspace(this._tfvcFolder);
        this._tfvcRemoteUrl = this._tfvcWorkspace?.server;
        this._isTeamServicesUrl = RepoUtils.IsTeamFoundationServicesRepo(this._tfvcRemoteUrl!);
        this._isTeamFoundationServer = RepoUtils.IsTeamFoundationServerRepo(this._tfvcRemoteUrl!);
        this._teamProjectName = this._tfvcWorkspace?.defaultTeamProject;
        Logger.LogDebug(`Found a TFVC repository for url: '${this._tfvcRemoteUrl}' and team project: '${this._teamProjectName}'.`);
        return true;
    }

    // Tfvc implementation
    public get TeamProjectName(): string | undefined {
        return this._teamProjectName;
    }

    public get TfvcRepository(): TfvcRepository | undefined {
        return this._repo;
    }

    public set TfvcRepository(newRepository: TfvcRepository | undefined) {
        // Don't let the repository be undefined
        if (newRepository) {
            this._repo = newRepository;
        }
    }

    public get TfvcWorkspace(): IWorkspace | undefined {
        return this._tfvcWorkspace;
    }

    // Git implementation
    public get CurrentBranch(): string | undefined {
        return undefined;
    }
    public get CurrentRef(): string | undefined {
        return undefined;
    }

    // IRepositoryContext implementation
    public get RepoFolder(): string {
        return this._tfvcFolder;
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
    public get RemoteUrl(): string {
        if (this._tfvcRemoteUrl) {
            return this._tfvcRemoteUrl;
        }
        return "";
    }
    public get RepositoryParentFolder(): string | undefined {
        return this._gitParentFolder;
    }
    public get Type(): RepositoryType {
        return RepositoryType.TFVC;
    }

    //This is used if we need to update the RemoteUrl after validating the TFVC collection with the repositoryinfoclient
    public set RemoteUrl(remoteUrl: string) {
        this._tfvcRemoteUrl = remoteUrl;
    }
}
