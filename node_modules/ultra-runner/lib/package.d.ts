import { PackageJson as PJson } from "type-fest";
export declare type PackageJson = PJson & {
    name: string;
    ultra?: {
        concurrent?: string[];
    };
};
export declare type PackageJsonWithRoot = PackageJson & {
    root: string;
};
interface FindPackagesOption {
    includeRoot?: boolean;
    ignore?: string[];
    cwd?: string;
}
export declare function findPackages(patterns: string[], options?: FindPackagesOption): Promise<string[]>;
export declare function findUp(name: string, cwd?: string): string | undefined;
export declare function getPackage(root: string): PackageJsonWithRoot | undefined;
export {};
