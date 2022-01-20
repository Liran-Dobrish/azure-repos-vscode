/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { workspace } from "vscode";
import { SettingNames, WitQueries } from "./constants";
import { Logger } from "../helpers/logger";

export abstract class BaseSettings {
    protected readSetting<T>(name: string, defaultValue: T | undefined): T | undefined {
        const configuration = workspace.getConfiguration();
        const value = configuration.get<T | undefined>(name, undefined);

        // If user specified a value, use it
        if (value !== undefined) {
            return value;
        }
        return defaultValue;
    }

    protected writeSetting(name: string, value: any, global?: boolean): void {
        const configuration = workspace.getConfiguration();
        configuration.update(name, value, global);
    }
}

export interface IPinnedQuery {
    queryText?: string;
    queryPath?: string;
    account: string;
}

export class PinnedQuerySettings extends BaseSettings {
    private _pinnedQuery: IPinnedQuery | undefined;
    private _account: string;

    constructor(account: string) {
        super();
        this._account = account;
        this._pinnedQuery = this.getPinnedQuery(account);
    }

    private getPinnedQuery(account: string): IPinnedQuery | undefined {
        const pinnedQueries = this.readSetting<IPinnedQuery[]>(SettingNames.PinnedQueries, undefined);
        if (pinnedQueries !== undefined) {
            Logger.LogDebug("Found pinned queries in user configuration settings.");
            let global: IPinnedQuery | undefined = undefined;
            for (let index: number = 0; index < pinnedQueries.length; index++) {
                const element = pinnedQueries[index];
                if (element.account === account ||
                    element.account === account + ".visualstudio.com") {
                    return element;
                } else if (element.account === "global") {
                    global = element;
                }
            }
            if (global !== undefined) {
                Logger.LogDebug("No account-specific pinned query found, using global pinned query.");
                return global;
            }
        }
        Logger.LogDebug("No account-specific pinned query or global pinned query found. Using default.");
        return undefined;
    }

    public get PinnedQuery(): IPinnedQuery {
        return this._pinnedQuery || { account: this._account, queryText: WitQueries.MyWorkItems };
    }
}

export interface ISettings {
    AppInsightsEnabled: boolean | undefined;
    AppInsightsKey: string | undefined;
    LoggingLevel: string | undefined;
    PollingInterval: number | undefined;
    RemoteUrl: string | undefined;
    TeamProject: string | undefined;
    BuildDefinitionId: number | undefined;
    ShowWelcomeMessage: boolean | undefined;
}

export class Settings extends BaseSettings implements ISettings {
    private _appInsightsEnabled: boolean | undefined;
    private _appInsightsKey: string | undefined;
    private _loggingLevel: string | undefined;
    private _pollingInterval: number | undefined;
    private _remoteUrl: string | undefined;
    private _teamProject: string | undefined;
    private _buildDefinitionId: number | undefined;
    private _showWelcomeMessage: boolean | undefined;

    constructor() {
        super();

        const loggingLevel = SettingNames.LoggingLevel;
        this._loggingLevel = this.readSetting<string>(loggingLevel, undefined);

        const pollingInterval = SettingNames.PollingInterval;
        this._pollingInterval = this.readSetting<number>(pollingInterval, 10);
        Logger.LogDebug("Polling interval value (minutes): " + this._pollingInterval?.toString());
        if (this._pollingInterval) {
            // Ensure a minimum value when an invalid value is set        
            if (this._pollingInterval < 10) {
                Logger.LogDebug("Polling interval must be greater than 10 minutes.");
                this._pollingInterval = 10;
            }
        }

        this._appInsightsEnabled = this.readSetting<boolean>(SettingNames.AppInsightsEnabled, true);
        this._appInsightsKey = this.readSetting<string>(SettingNames.AppInsightsKey, undefined);
        this._remoteUrl = this.readSetting<string>(SettingNames.RemoteUrl, undefined);
        this._teamProject = this.readSetting<string>(SettingNames.TeamProject, undefined);
        this._buildDefinitionId = this.readSetting<number>(SettingNames.BuildDefinitionId, 0);
        this._showWelcomeMessage = this.readSetting<boolean>(SettingNames.ShowWelcomeMessage, true);
    }

    public get AppInsightsEnabled(): boolean | undefined {
        return this._appInsightsEnabled;
    }

    public get AppInsightsKey(): string | undefined {
        return this._appInsightsKey;
    }

    public get LoggingLevel(): string | undefined {
        return this._loggingLevel;
    }

    public get PollingInterval(): number | undefined {
        return this._pollingInterval;
    }

    public get RemoteUrl(): string | undefined {
        return this._remoteUrl;
    }

    public get TeamProject(): string | undefined {
        return this._teamProject;
    }

    public get BuildDefinitionId(): number | undefined {
        return this._buildDefinitionId;
    }

    public get ShowWelcomeMessage(): boolean | undefined {
        return this._showWelcomeMessage;
    }
    public set ShowWelcomeMessage(value: boolean | undefined) {
        this.writeSetting(SettingNames.ShowWelcomeMessage, value, true /*global*/);
    }
}
