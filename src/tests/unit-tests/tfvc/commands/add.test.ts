/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { assert } from "chai";
import * as path from "path";
import { Add } from "../../../../tfvc/commands/add";
//import { TfvcError } from "../../../src/tfvc/tfvcerror";
import { IExecutionResult } from "../../../../tfvc/interfaces";
import { TeamServerContext } from "../../../../contexts/servercontext";
import { CredentialInfo } from "../../../../info/credentialinfo";
import { RepositoryInfo } from "../../../../info/repositoryinfo";

suite("Tfvc-AddCommand", function() {
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

    test("should verify constructor - windows", function() {
        const localPaths: string[] = ["c:\\repos\\Tfvc.L2VSCodeExtension.RC\\README.md"];
        new Add(new TeamServerContext(""), localPaths);
    });

    test("should verify constructor - mac/linux", function() {
        const localPaths: string[] = ["/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/README.md"];
        new Add(new TeamServerContext(""), localPaths);
    });

    test("should verify constructor with context", function() {
        const localPaths: string[] = ["/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/README.md"];
        new Add(context, localPaths);
    });

    // Todo: Fix...
    // test("should verify constructor - undefined args", function() {
    //     assert.throws(() => new Add(new TeamServerContext(""), undefined), TfvcError, /Argument is required/);
    // });

    test("should verify GetOptions", function() {
        const localPaths: string[] = ["/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/README.md"];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);
        assert.deepEqual(cmd.GetOptions(), {});
    });

    test("should verify GetExeOptions", function() {
        const localPaths: string[] = ["/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/README.md"];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);
        assert.deepEqual(cmd.GetExeOptions(), {});
    });

    test("should verify arguments", function() {
        const localPaths: string[] = ["/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/README.md"];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);

        assert.equal(cmd.GetArguments().GetArgumentsForDisplay(), "add -noprompt " + localPaths[0]);
    });

    test("should verify Exe arguments", function() {
        const localPaths: string[] = ["/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/README.md"];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);

        assert.equal(cmd.GetExeArguments().GetArgumentsForDisplay(), "add -noprompt " + localPaths[0]);
    });

    test("should verify arguments with context", function() {
        const localPaths: string[] = ["/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/README.md"];
        const cmd: Add = new Add(context, localPaths);

        assert.equal(cmd.GetArguments().GetArgumentsForDisplay(), "add -noprompt -collection:" + collectionUrl + " ******** " + localPaths[0]);
    });

    test("should verify Exe arguments with context", function() {
        const localPaths: string[] = ["/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/README.md"];
        const cmd: Add = new Add(context, localPaths);

        assert.equal(cmd.GetExeArguments().GetArgumentsForDisplay(), "add -noprompt ******** " + localPaths[0]);
    });

    test("should verify parse output - no files to add", async function() {
        const localPaths: string[] = ["/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/file-does-not-exist.md"];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: "No arguments matched any files to add.",
            stderr: undefined
        };

        const filesAdded: string[] = await cmd.ParseOutput(executionResult);
        assert.equal(filesAdded.length, 0);
    });

    test("should verify parse output - single empty folder - no errors", async function() {
        const localPaths: string[] = ["empty-folder"];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: "empty-folder:\n" +
                    "empty-folder\n",
            stderr: undefined
        };

        const filesAdded: string[] = await cmd.ParseOutput(executionResult);
        assert.equal(filesAdded.length, 1);
        //In this case, the CLC returns:
        //empty-folder:
        //empty-folder
        //So we will have to return empty-folder\empty-folder.  Not ideal but let's ensure we're getting that.
        assert.equal(filesAdded[0], path.join(localPaths[0], localPaths[0]));
    });

    test("should verify parse output - single folder+file - no errors", async function() {
        const localPaths: string[] = [path.join("folder1", "file1.txt")];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: "folder1:\n" +
                    "file1.txt\n",
            stderr: undefined
        };

        const filesAdded: string[] = await cmd.ParseOutput(executionResult);
        assert.equal(filesAdded.length, 1);
        assert.equal(filesAdded[0], localPaths[0]);
    });

    test("should verify parse output - single subfolder+file - no errors", async function() {
        const localPaths: string[] = [path.join("folder1", "folder2", "file2.txt")];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: path.join("folder1", "folder2") + ":\n" +
                    "file2.txt\n",
            stderr: undefined
        };

        const filesAdded: string[] = await cmd.ParseOutput(executionResult);
        assert.equal(filesAdded.length, 1);
        assert.equal(filesAdded[0], localPaths[0]);
    });

    test("should verify parse output - single folder+file - spaces - no errors", async function() {
        const localPaths: string[] = [path.join("fold er1", "file1.txt")];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: "fold er1:\n" +
                    "file1.txt\n",
            stderr: undefined
        };

        const filesAdded: string[] = await cmd.ParseOutput(executionResult);
        assert.equal(filesAdded.length, 1);
        assert.equal(filesAdded[0], localPaths[0]);
    });

    /// Verify ParseExeOutput values (for tf.exe)
    test("should verify parse Exe output - no files to add", async function() {
        const localPaths: string[] = ["/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/file-does-not-exist.md"];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);
        //This return value is different for tf.exe than the CLC
        const executionResult: IExecutionResult = {
            exitCode: 1,
            stdout: "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/file-does-not-exist.md: No file matches.",
            stderr: undefined
        };

        const filesAdded: string[] = await cmd.ParseExeOutput(executionResult);
        assert.equal(filesAdded.length, 0);
    });

    test("should verify parse Exe output - single empty folder - no errors", async function() {
        const localPaths: string[] = ["empty-folder"];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);
        //This return value is different for tf.exe than the CLC
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: "empty-folder\n",
            stderr: undefined
        };

        const filesAdded: string[] = await cmd.ParseExeOutput(executionResult);
        assert.equal(filesAdded.length, 1);
        //In this case, the EXE returns (this differs from the CLC):
        //empty-folder
        assert.equal(filesAdded[0], localPaths[0]);
    });

    test("should verify parse Exe output - single folder+file - no errors", async function() {
        const localPaths: string[] = [path.join("folder1", "file1.txt")];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: "folder1:\n" +
                    "file1.txt\n",
            stderr: undefined
        };

        const filesAdded: string[] = await cmd.ParseExeOutput(executionResult);
        assert.equal(filesAdded.length, 1);
        assert.equal(filesAdded[0], localPaths[0]);
    });

    test("should verify parse Exe output - single subfolder+file - no errors", async function() {
        const localPaths: string[] = [path.join("folder1", "folder2", "file2.txt")];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: path.join("folder1", "folder2") + ":\n" +
                    "file2.txt\n",
            stderr: undefined
        };

        const filesAdded: string[] = await cmd.ParseExeOutput(executionResult);
        assert.equal(filesAdded.length, 1);
        assert.equal(filesAdded[0], localPaths[0]);
    });

    test("should verify parse Exe output - single folder+file - spaces - no errors", async function() {
        const localPaths: string[] = [path.join("fold er1", "file1.txt")];
        const cmd: Add = new Add(new TeamServerContext(""), localPaths);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: "fold er1:\n" +
                    "file1.txt\n",
            stderr: undefined
        };

        const filesAdded: string[] = await cmd.ParseExeOutput(executionResult);
        assert.equal(filesAdded.length, 1);
        assert.equal(filesAdded[0], localPaths[0]);
    });
});
