/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { assert, expect } from "chai";

import { Build, BuildBadge } from "azure-devops-node-api/interfaces/BuildInterfaces";
import { Mocks } from "../helpers-integration/mocks";
import { TestSettings } from "../helpers-integration/testsettings";
import { CredentialManager } from "../../../helpers/credentialmanager";
import { UserAgentProvider } from "../../../helpers/useragentprovider";
import { TeamServerContext } from "../../../contexts/servercontext";
import { BuildService } from "../../../services/build";
import { WellKnownRepositoryTypes } from "../../../helpers/constants";

suite("BuildService-Integration", function () {
    this.timeout(TestSettings.SuiteTimeout);

    const credentialManager: CredentialManager = new CredentialManager();
    const ctx: TeamServerContext = Mocks.TeamServerContext(TestSettings.RemoteRepositoryUrl);

    before(function () {
        UserAgentProvider.VSCodeVersion = "0.0.0";
        return credentialManager.StoreCredentials(ctx, TestSettings.AccountUser, TestSettings.Password);
    });
    beforeEach(function () {
        return credentialManager.GetCredentials(ctx);
    });
    // afterEach(function() { });
    after(function () {
        return credentialManager.RemoveCredentials(ctx);
    });

    test("should verify BuildService.GetBuildDefinitions", async function () {
        this.timeout(TestSettings.TestTimeout); //http://mochajs.org/#timeouts

        const ctx: TeamServerContext = Mocks.TeamServerContext(TestSettings.RemoteRepositoryUrl);
        ctx.CredentialHandler = CredentialManager.GetCredentialHandler();
        ctx.RepoInfo = Mocks.RepositoryInfo();
        ctx.UserInfo = undefined;

        const svc: BuildService = new BuildService(ctx);
        const definitions = await svc.GetBuildDefinitions(TestSettings.TeamProject);
        assert.isNotNull(definitions, "definitions was null when it shouldn't have been");
        //console.log(definitions.length);
        expect(definitions.length).to.be.at.least(1);
    });

    test("should verify BuildService.GetBuildById", async function () {
        this.timeout(TestSettings.TestTimeout); //http://mochajs.org/#timeouts

        const ctx: TeamServerContext = Mocks.TeamServerContext(TestSettings.RemoteRepositoryUrl);
        ctx.CredentialHandler = CredentialManager.GetCredentialHandler();
        ctx.RepoInfo = Mocks.RepositoryInfo();
        ctx.UserInfo = undefined;

        const svc: BuildService = new BuildService(ctx);
        const build: Build = await svc.GetBuildById(ctx.RepoInfo.TeamProject, TestSettings.BuildId);
        assert.isNotNull(build, "build was null when it shouldn't have been");
        //console.log(definitions.length);
        expect(build.buildNumber).to.equal(TestSettings.BuildId.toString());
    });

    test("should verify BuildService.GetBuilds", async function () {
        this.timeout(TestSettings.TestTimeout); //http://mochajs.org/#timeouts

        const ctx: TeamServerContext = Mocks.TeamServerContext(TestSettings.RemoteRepositoryUrl);
        ctx.CredentialHandler = CredentialManager.GetCredentialHandler();
        ctx.RepoInfo = Mocks.RepositoryInfo();
        ctx.UserInfo = undefined;

        const svc: BuildService = new BuildService(ctx);
        const builds = await svc.GetBuilds(TestSettings.TeamProject);
        assert.isNotNull(builds, "builds was null when it shouldn't have been");
        //console.log(builds.length);
        expect(builds.length).to.be.at.least(1);
    });

    test("should verify BuildService.GetBuildsByDefinitionId", async function () {
        this.timeout(TestSettings.TestTimeout); //http://mochajs.org/#timeouts

        const ctx: TeamServerContext = Mocks.TeamServerContext(TestSettings.RemoteRepositoryUrl);
        ctx.CredentialHandler = CredentialManager.GetCredentialHandler();
        ctx.RepoInfo = Mocks.RepositoryInfo();
        ctx.UserInfo = undefined;

        const svc: BuildService = new BuildService(ctx);
        const builds: Build[] = await svc.GetBuildsByDefinitionId(TestSettings.TeamProject, TestSettings.BuildDefinitionId);
        assert.isNotNull(builds, "builds was null when it shouldn't have been");
        //console.log(definitions.length);
        expect(builds.length).to.equal(1);
    });

    test("should verify BuildService.GetBuildBadge", async function () {
        this.timeout(TestSettings.TestTimeout); //http://mochajs.org/#timeouts

        const ctx: TeamServerContext = Mocks.TeamServerContext(TestSettings.RemoteRepositoryUrl);
        ctx.CredentialHandler = CredentialManager.GetCredentialHandler();
        ctx.RepoInfo = Mocks.RepositoryInfo();
        ctx.UserInfo = undefined;

        const svc: BuildService = new BuildService(ctx);
        const badge: BuildBadge = await svc.GetBuildBadge(TestSettings.TeamProject, WellKnownRepositoryTypes.TfsGit, TestSettings.RepositoryId, "refs/heads/master");
        assert.isNotNull(badge, "badge was null when it shouldn't have been");
    });

});
