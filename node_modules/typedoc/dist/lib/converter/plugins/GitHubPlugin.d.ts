import { ConverterComponent } from "../components";
/**
 * Stores data of a repository.
 */
export declare class Repository {
    /**
     * The root path of this repository.
     */
    path: string;
    /**
     * The name of the branch this repository is on right now.
     */
    branch: string;
    /**
     * A list of all files tracked by the repository.
     */
    files: string[];
    /**
     * The user/organization name of this repository on GitHub.
     */
    gitHubUser?: string;
    /**
     * The project name of this repository on GitHub.
     */
    gitHubProject?: string;
    /**
     * The hostname for this github project.
     *
     * Defaults to: `github.com` (for normal, public GitHub instance projects)
     *
     * Or the hostname for an enterprise version of GitHub, e.g. `github.acme.com`
     * (if found as a match in the list of git remotes).
     */
    gitHubHostname: string;
    /**
     * Create a new Repository instance.
     *
     * @param path  The root path of the repository.
     */
    constructor(path: string, gitRevision: string, repoLinks: string[]);
    /**
     * Check whether the given file is tracked by this repository.
     *
     * @param fileName  The name of the file to test for.
     * @returns TRUE when the file is part of the repository, otherwise FALSE.
     */
    contains(fileName: string): boolean;
    /**
     * Get the URL of the given file on GitHub.
     *
     * @param fileName  The file whose GitHub URL should be determined.
     * @returns An url pointing to the web preview of the given file or NULL.
     */
    getGitHubURL(fileName: string): string | undefined;
    /**
     * Try to create a new repository instance.
     *
     * Checks whether the given path is the root of a valid repository and if so
     * creates a new instance of [[Repository]].
     *
     * @param path  The potential repository root.
     * @returns A new instance of [[Repository]] or undefined.
     */
    static tryCreateRepository(path: string, gitRevision: string, gitRemote: string): Repository | undefined;
}
/**
 * A handler that watches for repositories with GitHub origin and links
 * their source files to the related GitHub pages.
 */
export declare class GitHubPlugin extends ConverterComponent {
    /**
     * List of known repositories.
     */
    private repositories;
    /**
     * List of paths known to be not under git control.
     */
    private ignoredPaths;
    readonly gitRevision: string;
    readonly gitRemote: string;
    /**
     * Create a new GitHubHandler instance.
     *
     * @param converter  The converter this plugin should be attached to.
     */
    initialize(): void;
    /**
     * Check whether the given file is placed inside a repository.
     *
     * @param fileName  The name of the file a repository should be looked for.
     * @returns The found repository info or undefined.
     */
    private getRepository;
    /**
     * Triggered when the converter has finished resolving a project.
     *
     * @param context  The context object describing the current state the converter is in.
     */
    private onEndResolve;
}
