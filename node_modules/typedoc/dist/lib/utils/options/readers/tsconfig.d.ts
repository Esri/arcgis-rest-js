import { OptionsReader, Options } from "../options";
import { Logger } from "../../loggers";
export declare class TSConfigReader implements OptionsReader {
    /**
     * Note: Runs after the [[TypeDocReader]].
     */
    priority: number;
    name: string;
    read(container: Options, logger: Logger): void;
}
