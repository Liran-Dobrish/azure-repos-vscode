/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { ISettings } from "../../../helpers/settings";

//Used to test the GitContext, ExternalContext classes
export class SettingsMock implements ISettings {
    /* tslint:disable:variable-name */
    constructor(public AppInsightsEnabled: boolean|undefined, public AppInsightsKey: string|undefined, public LoggingLevel: string|undefined,
                public PollingInterval: number|undefined, public RemoteUrl: string|undefined, public TeamProject: string|undefined, public BuildDefinitionId: number|undefined,
                public ShowWelcomeMessage: boolean|undefined) {
        //nothing to do
    }
    /* tslint:enable:variable-name */
}
