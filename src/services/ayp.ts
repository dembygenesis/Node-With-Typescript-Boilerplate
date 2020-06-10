import Database from "./database/database";
import {Ayp} from "../types/ayp";


export default class AypService {

    private database: Database;

    constructor() {
        this.database = global.database;
    }

    public async getAll() {
        try {
            const data = await this.database.query('SELECT * FROM ayp;');

            return data;
        } catch (e) {
            console.log('error', e);
            return e;
        }
    }

    public async update(data: Ayp) {
        try {
            const {
                part_number: partNumber,
                old_part_number: oldPartNumber,
                discount_code: discountCode,
                srp: srp,
                part_description: partDescription,
                applicable_model: applicableModel,
                block_no: blockNo,
                line_no: lineNo,
                pcs: pcs,
                amount: amount,
                id,
            } = data;

            const sql = `
                UPDATE 
                  ayp 
                SET
                  part_number = ?,
                  old_part_number = ?,
                  discount_code = ?,
                  srp = ?,
                  part_description = ?,
                  applicable_model = ?,
                  block_no = ?,
                  line_no = ?,
                  pcs = ?,
                  amount = ? 
                WHERE 1 = 1
                    AND id = ? 
            `;

            const query = await global.database.query(sql, [
                partNumber,
                oldPartNumber,
                discountCode,
                srp,
                partDescription,
                applicableModel,
                blockNo,
                lineNo,
                pcs,
                amount,
                id,
            ], true);

            return data;
        } catch (e) {
            console.log('error', e);
            return e;
        }
    }
}
