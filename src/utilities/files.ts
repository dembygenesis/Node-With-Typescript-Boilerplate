import Fs from 'fs';

export default class FileUtility {

    static getFileIfExists = (dir: string) => {
        return new Promise((resolve, reject) => {
            Fs.access(dir, 1, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

}
