/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { assert } from "chai";
import { Strings } from "../../../../helpers/strings";
import { ResolveConflicts } from "../../../../tfvc/commands/resolveconflicts";
//import { TfvcError } from "../../../src/tfvc/tfvcerror";
import { AutoResolveType, IExecutionResult, IConflict } from "../../../../tfvc/interfaces";
import { ConflictType } from "../../../../tfvc/scm/status";
import { TeamServerContext } from "../../../../contexts/servercontext";
import { CredentialInfo } from "../../../../info/credentialinfo";
import { RepositoryInfo } from "../../../../info/repositoryinfo";

suite("Tfvc-ResolveConflictsCommand", function() {
    const serverUrl: string = "http://server:8080/tfs";
    const repoUrl: string = "http://server:8080/tfs/collection1/_git/repo1";
    const collectionUrl: string = "http://server:8080/tfs/collection1";
    const user: string = "user1";
    const pass: string = "pass1";
    let context: TeamServerContext;

    beforeEach(function() {
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

    test("should verify constructor", function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        new ResolveConflicts(new TeamServerContext(""), localPaths, AutoResolveType.KeepYours);
    });

    test("should verify constructor with context", function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        new ResolveConflicts(context, localPaths, AutoResolveType.KeepYours);
    });

    // ToDo: Fix...
    // test("should verify constructor - undefined args", function() {
    //     assert.throws(() => new ResolveConflicts(new TeamServerContext(""), undefined, undefined), TfvcError, /Argument is required/);
    // });

    test("should verify GetOptions", function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(new TeamServerContext(""), localPaths, AutoResolveType.KeepYours);
        assert.deepEqual(cmd.GetOptions(), {});
    });

    test("should verify GetExeOptions", function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(new TeamServerContext(""), localPaths, AutoResolveType.KeepYours);
        assert.deepEqual(cmd.GetExeOptions(), {});
    });

    test("should verify arguments", function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(new TeamServerContext(""), localPaths, AutoResolveType.KeepYours);

        assert.equal(cmd.GetArguments().GetArgumentsForDisplay(), "resolve -noprompt " + localPaths[0] + " -auto:KeepYours");
    });

    test("should verify arguments with context", function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(context, localPaths, AutoResolveType.KeepYours);

        assert.equal(cmd.GetArguments().GetArgumentsForDisplay(), "resolve -noprompt -collection:" + collectionUrl + " ******** " + localPaths[0] + " -auto:KeepYours");
    });

    test("should verify arguments with TakeTheirs", function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(context, localPaths, AutoResolveType.TakeTheirs);

        assert.equal(cmd.GetArguments().GetArgumentsForDisplay(), "resolve -noprompt -collection:" + collectionUrl + " ******** " + localPaths[0] + " -auto:TakeTheirs");
    });

    test("should verify GetExeArguments", function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(new TeamServerContext(""), localPaths, AutoResolveType.KeepYours);

        assert.equal(cmd.GetExeArguments().GetArgumentsForDisplay(), "resolve -noprompt " + localPaths[0] + " -auto:KeepYours");
    });

    test("should verify GetExeArguments with context", function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(context, localPaths, AutoResolveType.KeepYours);

        assert.equal(cmd.GetExeArguments().GetArgumentsForDisplay(), "resolve -noprompt ******** " + localPaths[0] + " -auto:KeepYours");
    });

    test("should verify GetExeArguments with TakeTheirs", function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(context, localPaths, AutoResolveType.TakeTheirs);

        assert.equal(cmd.GetExeArguments().GetArgumentsForDisplay(), "resolve -noprompt ******** " + localPaths[0] + " -auto:TakeTheirs");
    });

    test("should verify parse output - no output", async function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(new TeamServerContext(""), localPaths, AutoResolveType.KeepYours);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: undefined,
            stderr: undefined
        };

        const results: IConflict[] = await cmd.ParseOutput(executionResult);
        assert.equal(results.length, 0);
    });

    test("should verify parse output - no errors", async function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt", "/usr/alias/repo1/file2.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(new TeamServerContext(""), localPaths, AutoResolveType.KeepYours);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: "Resolved /usr/alias/repo1/file.txt as KeepYours\n" +
                    "Resolved /usr/alias/repo1/file2.txt as KeepYours",
            stderr: undefined
        };

        const results: IConflict[] = await cmd.ParseOutput(executionResult);
        assert.equal(results.length, 2);
        assert.equal(results[0].localPath, "/usr/alias/repo1/file.txt");
        assert.equal(results[0].type, ConflictType.RESOLVED);
        assert.equal(results[1].localPath, "/usr/alias/repo1/file2.txt");
        assert.equal(results[1].type, ConflictType.RESOLVED);
    });

    test("should verify parse output - errors - exit code 100", async function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(new TeamServerContext(""), localPaths, AutoResolveType.KeepYours);
        const executionResult: IExecutionResult = {
            exitCode: 100,
            stdout: "Something bad this way comes.",
            stderr: undefined
        };

        try {
            await cmd.ParseOutput(executionResult);
        } catch (err : any) {
            assert.equal(err.exitCode, 100);
            assert.isTrue(err.message.startsWith(Strings.TfExecFailedError));
        }
    });

    /***********************************************************************************************
     * The methods below are duplicates of the parse output methods but call the parseExeOutput.
     ***********************************************************************************************/

    test("should verify parse EXE output - no output", async function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(new TeamServerContext(""), localPaths, AutoResolveType.KeepYours);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: undefined,
            stderr: undefined
        };

        const results: IConflict[] = await cmd.ParseExeOutput(executionResult);
        assert.equal(results.length, 0);
    });

    test("should verify parse EXE output - no errors", async function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt", "/usr/alias/repo1/file2.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(new TeamServerContext(""), localPaths, AutoResolveType.KeepYours);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: "Resolved /usr/alias/repo1/file.txt as KeepYours\n" +
                    "Resolved /usr/alias/repo1/file2.txt as KeepYours",
            stderr: undefined
        };

        const results: IConflict[] = await cmd.ParseExeOutput(executionResult);
        assert.equal(results.length, 2);
        assert.equal(results[0].localPath, "/usr/alias/repo1/file.txt");
        assert.equal(results[0].type, ConflictType.RESOLVED);
        assert.equal(results[1].localPath, "/usr/alias/repo1/file2.txt");
        assert.equal(results[1].type, ConflictType.RESOLVED);
    });

    test("should verify parse EXE output - errors - exit code 100", async function() {
        const localPaths: string[] = ["/usr/alias/repo1/file.txt"];
        const cmd: ResolveConflicts = new ResolveConflicts(new TeamServerContext(""), localPaths, AutoResolveType.KeepYours);
        const executionResult: IExecutionResult = {
            exitCode: 100,
            stdout: "Something bad this way comes.",
            stderr: undefined
        };

        try {
            await cmd.ParseExeOutput(executionResult);
        } catch (err : any) {
            assert.equal(err.exitCode, 100);
            assert.isTrue(err.message.startsWith(Strings.TfExecFailedError));
        }
    });
});
