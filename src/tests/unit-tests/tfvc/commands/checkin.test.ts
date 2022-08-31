/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { assert } from "chai";

import { Checkin } from "../../../../tfvc/commands/checkin";
//import { TfvcError } from "../../../src/tfvc/tfvcerror";
import { IExecutionResult } from "../../../../tfvc/interfaces";
import { TeamServerContext } from "../../../../contexts/servercontext";
import { CredentialInfo } from "../../../../info/credentialinfo";
import { RepositoryInfo } from "../../../../info/repositoryinfo";

suite("Tfvc-CheckinCommand", function () {
    const serverUrl: string = "http://server:8080/tfs";
    const repoUrl: string = "http://server:8080/tfs/collection1/_git/repo1";
    const collectionUrl: string = "http://server:8080/tfs/collection1";
    const user: string = "user1";
    const pass: string = "pass1";
    let context: TeamServerContext;

    beforeEach(function () {
        context = new TeamServerContext(repoUrl);
        context.CredentialInfo = new CredentialInfo(user, pass);
        context.RepoInfo = new RepositoryInfo({
            serverUrl: serverUrl,
            collection: {
                name: "collection1",
                id: ""
            },
            repository: {
                remoteUrl: repoUrl,
                id: "",
                name: "",
                project: {
                    name: "project1"
                }
            }
        });
    });

    test("should verify constructor", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        new Checkin(new TeamServerContext(""), files);
    });

    test("should verify constructor with context", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        new Checkin(context, files);
    });

    // ToDo: Fix...
    // test("should verify constructor - undefined args", function() {
    //     assert.throws(() => new Checkin(new TeamServerContext(""), undefined), TfvcError, /Argument is required/);
    // });

    test("should verify GetOptions", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(new TeamServerContext(""), files);
        assert.deepEqual(cmd.GetOptions(), {});
    });

    test("should verify GetExeOptions", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(new TeamServerContext(""), files);
        assert.deepEqual(cmd.GetExeOptions(), {});
    });

    test("should verify arguments", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(new TeamServerContext(""), files);

        assert.equal(cmd.GetArguments().GetArgumentsForDisplay(), "checkin -noprompt " + files[0]);
    });

    test("should verify Exe arguments", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(new TeamServerContext(""), files);

        assert.equal(cmd.GetExeArguments().GetArgumentsForDisplay(), "checkin -noprompt " + files[0]);
    });

    test("should verify arguments with context", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(context, files);

        assert.equal(cmd.GetArguments().GetArgumentsForDisplay(), "checkin -noprompt -collection:" + collectionUrl + " ******** " + files[0]);
    });

    test("should verify Exe arguments with context", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(context, files);

        assert.equal(cmd.GetExeArguments().GetArgumentsForDisplay(), "checkin -noprompt ******** " + files[0]);
    });

    test("should verify arguments with workitems", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(context, files, undefined, [1, 2, 3]);

        assert.equal(cmd.GetArguments().GetArgumentsForDisplay(), "checkin -noprompt -collection:" + collectionUrl + " ******** " + files[0] + " -associate:1,2,3");
    });

    test("should verify Exe arguments with workitems", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(context, files, undefined, [1, 2, 3]);

        //Note that no associate option should be here (tf.exe doesn't support it)
        assert.equal(cmd.GetExeArguments().GetArgumentsForDisplay(), "checkin -noprompt ******** " + files[0]);
    });

    test("should verify arguments with comment", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(context, files, "a comment\nthat has\r\nmultiple lines");

        assert.equal(cmd.GetArguments().GetArgumentsForDisplay(), "checkin -noprompt -collection:" + collectionUrl + " ******** " + files[0] + " -comment:a comment that has multiple lines");
    });

    test("should verify Exe arguments with comment", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(context, files, "a comment\nthat has\r\nmultiple lines");

        assert.equal(cmd.GetExeArguments().GetArgumentsForDisplay(), "checkin -noprompt ******** " + files[0] + " -comment:a comment that has multiple lines");
    });

    test("should verify arguments with all params", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(context, files, "a comment", [1, 2, 3]);

        assert.equal(cmd.GetArguments().GetArgumentsForDisplay(), "checkin -noprompt -collection:" + collectionUrl + " ******** " + files[0] + " -comment:a comment -associate:1,2,3");
    });

    test("should verify Exe arguments with all params", function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(context, files, "a comment", [1, 2, 3]);

        //Note that no associate option should be here (tf.exe doesn't support it)
        assert.equal(cmd.GetExeArguments().GetArgumentsForDisplay(), "checkin -noprompt ******** " + files[0] + " -comment:a comment");
    });

    test("should verify parse output - no output", async function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(new TeamServerContext(""), files);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: undefined,
            stderr: undefined
        };

        const result: string | undefined = await cmd.ParseOutput(executionResult);
        assert.equal(result, "");
    });

    test("should verify parse output - no errors", async function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(new TeamServerContext(""), files);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: "/Users/leantk/tfvc-tfs/tfsTest_01/addFold:\n" +
                "Checking in edit: testHere.txt\n" +
                "\n" +
                "/Users/leantk/tfvc-tfs/tfsTest_01:\n" +
                "Checking in edit: test3.txt\n" +
                "Checking in edit: TestAdd.txt\n" +
                "\n" +
                "Changeset #23 checked in.\n",
            stderr: undefined
        };

        const result: string | undefined = await cmd.ParseOutput(executionResult);
        assert.equal(result, "23");
    });

    test("should verify parse output - with error", async function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(new TeamServerContext(""), files);
        const executionResult: IExecutionResult = {
            exitCode: 100,
            stdout: "/Users/leantk/tfvc-tfs/tfsTest_01:\n" +
                "Checking in edit: test3.txt\n" +
                "Checking in edit: TestAdd.txt\n" +
                "No files checked in.\n",
            stderr: "A resolvable conflict was flagged by the server: No files checked in due to conflicting changes.  Resolve the conflicts and try the check-in again.\n"
        };

        try {
            await cmd.ParseOutput(executionResult);
        } catch (err: any) {
            assert.equal(err.exitCode, 100);
        }
    });

    //
    //
    //
    test("should verify parse Exe output - no output", async function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(new TeamServerContext(""), files);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: undefined,
            stderr: undefined
        };

        const result: string | undefined = await cmd.ParseExeOutput(executionResult);
        assert.equal(result, "");
    });

    test("should verify parse Exe output - no errors", async function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(new TeamServerContext(""), files);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: "/Users/leantk/tfvc-tfs/tfsTest_01/addFold:\n" +
                "Checking in edit: testHere.txt\n" +
                "\n" +
                "/Users/leantk/tfvc-tfs/tfsTest_01:\n" +
                "Checking in edit: test3.txt\n" +
                "Checking in edit: TestAdd.txt\n" +
                "\n" +
                "Changeset #23 checked in.\n",
            stderr: undefined
        };

        const result: string | undefined = await cmd.ParseExeOutput(executionResult);
        assert.equal(result, "23");
    });

    test("should verify parse Exe output - with error", async function () {
        const files: string[] = ["/path/to/workspace/file.txt"];
        const cmd: Checkin = new Checkin(new TeamServerContext(""), files);
        const executionResult: IExecutionResult = {
            exitCode: 100,
            stdout: "/Users/leantk/tfvc-tfs/tfsTest_01:\n" +
                "Checking in edit: test3.txt\n" +
                "Checking in edit: TestAdd.txt\n" +
                "No files checked in.\n",
            stderr: "A resolvable conflict was flagged by the server: No files checked in due to conflicting changes.  Resolve the conflicts and try the check-in again.\n"
        };

        try {
            await cmd.ParseExeOutput(executionResult);
        } catch (err: any) {
            assert.equal(err.exitCode, 100);
        }
    });

});
