/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import basem from "azure-devops-node-api/ClientApiBases"
import VsoBaseInterfaces from "azure-devops-node-api/interfaces/common/VsoBaseInterfaces"
import { IRestResponse } from "typed-rest-client/RestClient"
import { LocationsApi } from "azure-devops-node-api/LocationsApi"
import { ConnectionData } from "azure-devops-node-api/interfaces/LocationsInterfaces";

export class TeamServicesApi extends basem.ClientApiBase {
    handlers: VsoBaseInterfaces.IRequestHandler[];
    constructor(baseUrl: string, handlers: VsoBaseInterfaces.IRequestHandler[]) {
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
            let response: IRestResponse<any> = await this.rest.get<any>(this.vsoClient.resolveUrl("/vsts/info"));// "", null, null, (err: any, statusCode: number, obj: any) => {
            /* tslint:enable:no-null-keyword */
            if (response.statusCode != 200) {
                reject(response);
            } else {
                resolve(response);
            }
        });
        return promise;
    }

    //Used to determine if the baseUrl points to a valid TFVC repository
    public async validateTfvcCollectionUrl(): Promise<any> {
        //Create an instance of Promise since we're calling a function with the callback pattern but want to return a Promise
        const promise: Promise<any> = new Promise<any>(async (resolve, reject) => {
            /* tslint:disable:no-null-keyword */
            let response: IRestResponse<any> = await this.rest.get<any>(this.vsoClient.resolveUrl("_apis/tfvc/branches"));//, "", null, null, (err: any, statusCode: number, obj: any) => {
            /* tslint:enable:no-null-keyword */
            if (response.statusCode != 200) {
                reject(response);
            } else {
                resolve(response);
            }
        });
        return promise;
    }

}
