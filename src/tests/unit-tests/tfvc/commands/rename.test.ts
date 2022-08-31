/*---------------------------------------------------------------------------------------------
*  Copyright (c) Microsoft Corporation. All rights reserved.
*  Licensed under the MIT License. See License.txt in the project root for license information.
*--------------------------------------------------------------------------------------------*/
"use strict";

import { assert } from "chai";
import * as path from "path";
import { Strings } from "../../../../helpers/strings";
import { Rename } from "../../../../tfvc/commands/rename";
//import { TfvcError, TfvcErrorCodes } from "../../../src/tfvc/tfvcerror";
import { TfvcErrorCodes } from "../../../../tfvc/tfvcerror";
import { IExecutionResult } from "../../../../tfvc/interfaces";
import { TeamServerContext } from "../../../../contexts/servercontext";
import { CredentialInfo } from "../../../../info/credentialinfo";
import { RepositoryInfo } from "../../../../info/repositoryinfo";

suite("Tfvc-RenameCommand", function() {
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
        const startPath: string = "c:\\repos\\Tfvc.L2VSCodeExtension.RC\\";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");
        new Rename(new TeamServerContext(""), sourcePath, destinationPath);
    });

    test("should verify constructor - mac/linux", function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");
        new Rename(new TeamServerContext(""), sourcePath, destinationPath);
    });

    test("should verify constructor with context", function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");
        new Rename(context, sourcePath, destinationPath);
    });

    // ToDo: Fix...
    // test("should verify constructor - no destination path", function() {
    //     const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
    //     const sourcePath: string = path.join(startPath, "README.md");
    //     assert.throws(() => new Rename(new TeamServerContext(""), sourcePath, undefined), TfvcError, /Argument is required/);
    // });

    // test("should verify constructor - no source path", function() {
    //     const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
    //     const destinationPath: string = path.join(startPath, "READU.md");
    //     assert.throws(() => new Rename(new TeamServerContext(""), undefined, destinationPath), TfvcError, /Argument is required/);
    // });

    test("should verify GetOptions", function() {
        const cmd: Rename = new Rename(context, "sourcePath", "destinationPath");
        assert.deepEqual(cmd.GetOptions(), {});
    });

    test("should verify GetExeOptions", function() {
        const cmd: Rename = new Rename(context, "sourcePath", "destinationPath");
        assert.deepEqual(cmd.GetExeOptions(), {});
    });

    test("should verify arguments", function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");

        const cmd: Rename = new Rename(context, sourcePath, destinationPath);

        assert.equal(cmd.GetArguments().GetArgumentsForDisplay(), "rename -noprompt -collection:" + collectionUrl + " ******** " + sourcePath + " " + destinationPath);
    });

    test("should verify GetExeArguments", function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");

        const cmd: Rename = new Rename(context, sourcePath, destinationPath);

        assert.equal(cmd.GetExeArguments().GetArgumentsForDisplay(), "rename -noprompt ******** " + sourcePath + " " + destinationPath);
    });

    test("should verify parse output - no output", async function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");

        const cmd: Rename = new Rename(context, sourcePath, destinationPath);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: undefined,
            stderr: undefined
        };

        const result: string = await cmd.ParseOutput(executionResult);
        assert.equal(result, "");
    });

    test("should verify parse output - single line", async function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");

        const cmd: Rename = new Rename(context, sourcePath, destinationPath);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: `READU.md`,
            stderr: undefined
        };

        const result: string = await cmd.ParseOutput(executionResult);
        assert.equal(result, "READU.md");
    });

    test("should verify parse output - with path", async function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");

        const cmd: Rename = new Rename(context, sourcePath, destinationPath);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: `${startPath}:\nREADU.md`,
            stderr: undefined
        };

        const result: string = await cmd.ParseOutput(executionResult);
        assert.equal(result, destinationPath);
    });

    test("should verify parse output - source file not in workspace", async function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");

        const cmd: Rename = new Rename(context, sourcePath, destinationPath);
        const executionResult: IExecutionResult = {
            exitCode: 100,
            stdout: undefined,
            stderr: `The item ${sourcePath} could not be found in your workspace, or you do not have permission to access it.\n`
        };

        try {
            await cmd.ParseOutput(executionResult);
        } catch (err : any) {
            assert.equal(err.exitCode, 100);
            assert.equal(err.tfvcErrorCode, TfvcErrorCodes.FileNotInWorkspace);
        }
    });

    test("should verify parse output - error exit code", async function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");

        const cmd: Rename = new Rename(context, sourcePath, destinationPath);
        const executionResult: IExecutionResult = {
            exitCode: 42,
            stdout: "Something bad this way comes.",
            stderr: undefined
        };

        try {
            await cmd.ParseOutput(executionResult);
        } catch (err : any) {
            assert.equal(err.exitCode, 42);
            assert.isTrue(err.message.startsWith(Strings.TfExecFailedError));
        }
    });

    /***********************************************************************************************
     * The methods below are duplicates of the parse output methods but call the parseExeOutput.
     ***********************************************************************************************/

    test("should verify parse EXE output - no output", async function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");

        const cmd: Rename = new Rename(context, sourcePath, destinationPath);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: undefined,
            stderr: undefined
        };

        const result: string = await cmd.ParseExeOutput(executionResult);
        assert.equal(result, "");
    });

    test("should verify parse EXE output - single line", async function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");

        const cmd: Rename = new Rename(context, sourcePath, destinationPath);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: `READU.md`,
            stderr: undefined
        };

        const result: string = await cmd.ParseExeOutput(executionResult);
        assert.equal(result, "READU.md");
    });

    test("should verify parse EXE output - with path", async function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");

        const cmd: Rename = new Rename(context, sourcePath, destinationPath);
        const executionResult: IExecutionResult = {
            exitCode: 0,
            stdout: `${startPath}:\nREADU.md`,
            stderr: undefined
        };

        const result: string = await cmd.ParseExeOutput(executionResult);
        assert.equal(result, destinationPath);
    });

    test("should verify parse EXE output - source file not in workspace", async function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");

        const cmd: Rename = new Rename(context, sourcePath, destinationPath);
        const executionResult: IExecutionResult = {
            exitCode: 100,
            stdout: undefined,
            stderr: `The item ${sourcePath} could not be found in your workspace, or you do not have permission to access it.\n`
        };

        try {
            await cmd.ParseExeOutput(executionResult);
        } catch (err : any) {
            assert.equal(err.exitCode, 100);
            assert.equal(err.tfvcErrorCode, TfvcErrorCodes.FileNotInWorkspace);
        }
    });

    test("should verify parse EXE output - error exit code", async function() {
        const startPath: string = "/usr/alias/repos/Tfvc.L2VSCodeExtension.RC/";
        const sourcePath: string = path.join(startPath, "README.md");
        const destinationPath: string = path.join(startPath, "READU.md");

        const cmd: Rename = new Rename(context, sourcePath, destinationPath);
        const executionResult: IExecutionResult = {
            exitCode: 42,
            stdout: "Something bad this way comes.",
            stderr: undefined
        };

        try {
            await cmd.ParseExeOutput(executionResult);
        } catch (err : any) {
            assert.equal(err.exitCode, 42);
            assert.isTrue(err.message.startsWith(Strings.TfExecFailedError));
        }
    });
});
