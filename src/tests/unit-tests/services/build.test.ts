/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { assert } from "chai";

import { BuildService } from "../../../services/build";

suite("BuildService", function() {

    beforeEach(function() {
        //
    });

    test("should verify GetBuildDefinitionsUrl", function() {
        const url: string = "https://account.visualstudio.com/DefaultCollection/project";

        //The new definitions experience is behind a feature flag
        //assert.equal(BuildService.GetBuildDefinitionsUrl(url), url + "/_build/definitions");
        assert.equal(BuildService.GetBuildDefinitionsUrl(url), url + "/_build");
    });

    test("should verify GetBuildDefinitionUrl", function() {
        const url: string = "https://account.visualstudio.com/DefaultCollection/project";
        const arg: string = "42";

        assert.equal(BuildService.GetBuildDefinitionUrl(url, arg), url + "/_build#_a=completed&definitionId=" + arg);
    });

    test("should verify GetBuildSummaryUrl", function() {
        const url: string = "https://account.visualstudio.com/DefaultCollection/project";
        const arg: string = "42";

        assert.equal(BuildService.GetBuildSummaryUrl(url, arg), url + "/_build/index?buildId=" + arg + "&_a=summary");
    });

    test("should verify GetBuildsUrl", function() {
        const url: string = "https://account.visualstudio.com/DefaultCollection/project";

        assert.equal(BuildService.GetBuildsUrl(url), url + "/_build");
    });
});
