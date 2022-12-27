/**
 * Returns the current working directory of given process id
 * 
 * Returns null if process doesn't exist, or unreachable because of permission denial or any other reason.
 * @param pid
 */
declare function cwd(pid: number): Promise<string>;
export default cwd;
export = cwd;
