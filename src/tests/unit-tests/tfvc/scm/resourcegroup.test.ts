/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { assert } from "chai";

import { Strings } from "../../../../helpers/strings";
import { ConflictsGroup, ExcludedGroup, IncludedGroup } from "../../../../tfvc/scm/resourcegroups";

suite("Tfvc-ResourceGroups", function() {
    beforeEach(function() {
        //
    });

    test("should verify ConflictsGroup - constructor", function() {
        const group: ConflictsGroup = new ConflictsGroup([]);
        assert.equal(group.id, "conflicts");
        assert.equal(group.label, Strings.ConflictsGroupName);
        assert.equal(group.resources.length, 0);
    });

    test("should verify ExcludedGroup - constructor", function() {
        const group: ExcludedGroup = new ExcludedGroup([]);
        assert.equal(group.id, "excluded");
        assert.equal(group.label, Strings.ExcludedGroupName);
        assert.equal(group.resources.length, 0);
    });

    test("should verify IncludedGroup - constructor", function() {
        const group: IncludedGroup = new IncludedGroup([]);
        assert.equal(group.id, "included");
        assert.equal(group.label, Strings.IncludedGroupName);
        assert.equal(group.resources.length, 0);
    });
});
