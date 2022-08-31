/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { assert } from "chai";
import { Logger, LoggingLevel } from "../../../helpers/logger";

suite("Logger", function() {

    beforeEach(function() {
        //
    });

    test("should cover Initialize", function() {
        Logger.SetLoggingLevel("error");
        Logger.LogWarning("unit test warning message");
        Logger.LogInfo("unit test info message");
        Logger.LogDebug("unit test debug message");
        Logger.LogObject({ property: "value" });
    });

    test("should verify setting LoggingLevel", function() {
        Logger.SetLoggingLevel("debug");
        assert.equal(Logger.LoggingLevel, LoggingLevel.Debug);
        Logger.SetLoggingLevel("error");
        assert.equal(Logger.LoggingLevel, LoggingLevel.Error);
        Logger.SetLoggingLevel("info");
        assert.equal(Logger.LoggingLevel, LoggingLevel.Info);
        Logger.SetLoggingLevel("verbose");
        assert.equal(Logger.LoggingLevel, LoggingLevel.Verbose);
        Logger.SetLoggingLevel("warn");
        assert.equal(Logger.LoggingLevel, LoggingLevel.Warn);
        Logger.SetLoggingLevel("foo");
        assert.isUndefined(Logger.LoggingLevel);
        Logger.SetLoggingLevel(undefined);
        assert.isUndefined(Logger.LoggingLevel);
    });

    test("should verify setting LogPath", function() {
        Logger.LogPath = undefined;
        assert.equal(Logger.LogPath, "");
        Logger.LogPath = "/usr/logger/logfile";
        assert.equal(Logger.LogPath, "/usr/logger/logfile");
    });

    test("should ensure getNow()", function() {
        const now: string = Logger.Now;  //calls private getNow()
        const date: number = Date.parse(now);
        assert.isDefined(date);
    });

});
