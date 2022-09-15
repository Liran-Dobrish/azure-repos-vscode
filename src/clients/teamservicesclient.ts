/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { IRequestHandler } from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces";
import { IRestResponse, IRequestOptions } from "typed-rest-client/RestClient";
import { LocationsApi } from "azure-devops-node-api/LocationsApi";
import { ConnectionData } from "azure-devops-node-api/interfaces/LocationsInterfaces";
import { ClientApiBase } from "azure-devops-node-api/ClientApiBases";
import { TfvcBranch, TypeInfo } from "azure-devops-node-api/interfaces/TfvcInterfaces";
import { ClientVersioningData } from "azure-devops-node-api/VsoClient";

export class TeamServicesApi extends ClientApiBase {
    handlers: IRequestHandler[];
    constructor(baseUrl: string, handlers: IRequestHandler[]) {
        super(baseUrl, handlers, "node-vsts-vscode-api");
        this.handlers = handlers;
    }

    public async connect(): Promise<ConnectionData> {
        return await (new LocationsApi(this.baseUrl, this.handlers)).getConnectionData();
    }

    //This calls the vsts/info endpoint (which only exists for Git)
    public async getVstsInfo(): Promise<any> {
        //Create an instance of Promise since we're calling a function with the callback pattern but want to return a Promise
        const promise: Promise<any> = new Promise<any>(async (resolve, reject) => {
            /* tslint:disable:no-null-keyword */
            const response: IRestResponse<any> = await this.rest.get<any>(this.vsoClient.resolveUrl("/vsts/info")); // "", null, null, (err: any, statusCode: number, obj: any) => {
            /* tslint:enable:no-null-keyword */
            if (response.statusCode !== 200) {
                reject(response);
            } else {
                resolve(response);
            }
        });
        return promise;
    }

    public async validateTfvcCollectionUrl(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                let routeValues: any = {
                    project: ""
                };

                let verData: ClientVersioningData = await this.vsoClient.getVersioningData(
                    "5.0",
                    "tfvc",
                    "bc1f417e-239d-42e7-85e1-76e80cb2d6eb",
                    routeValues);

                let url: string = verData.requestUrl!;
                let options: IRequestOptions = this.createRequestOptions('application/json', verData.apiVersion);

                let res: IRestResponse<TfvcBranch[]>;
                res = await this.rest.get<TfvcBranch[]>(url, options);

                let ret = this.formatResponse(res.result,
                    TypeInfo.TfvcBranch,
                    true);

                resolve(ret !== undefined);
            }
            catch (err) {
                reject(false);
            }
        });
    }
}
