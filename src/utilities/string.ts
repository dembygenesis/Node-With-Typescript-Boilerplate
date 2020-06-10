export default class StringUtility {

    static getEnv(idx: string): any {
        if (idx in process.env) {
            return process.env[idx];
        }

        return '';
    }

}
