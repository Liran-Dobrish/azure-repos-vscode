/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { assert } from "chai";

import { UserInfo } from "../../../info/userinfo";

suite("UserInfo", function() {

    test("should verify the constructor sets the proper values", function() {
        const user: UserInfo = new UserInfo("id", "providerDisplayName", "customDisplayName");
        assert.equal(user.Id, "id");
        assert.equal(user.ProviderDisplayName, "providerDisplayName");
        assert.equal(user.CustomDisplayName, "customDisplayName");
    });

});
