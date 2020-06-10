import Database from "../database/database";
import FileUtility from "../../utilities/files";
import Fs from 'fs';
import {insertedRecord} from "../../types";
import ValidationUtility from "../../utilities/validation";


export default class ProductService {

    private database: Database;

    constructor() {
        this.database = global.database;
    }

    public async add(req: any) {
        try {
            const {
                name,
                product_type_id: productTypeId
            } = req.body;

            const {
                image
            } = req.files;

            const fileType = image['mimetype'].split('/')[1];
            const newFileName = name + '.' + fileType;
            const imagesDirectory = './public/images';
            const userId = req.user[0]['id'];

            if (await FileUtility.getFileIfExists(imagesDirectory) === false) {
                Fs.mkdirSync(imagesDirectory);
            }

            const fileDir = imagesDirectory + '/' + newFileName;
            const fileUrl = '/images' + '/' + newFileName;

            await image.mv(fileDir);

            const sql = `
                INSERT INTO product (
                  name,
                  product_type_id,
                  created_by,
                  created_date,
                  is_active,
                  url
                ) 
                VALUES
                  (
                    ?,
                    ?,
                    ?,
                    NOW(),
                    1,
                    ?
                  ) ;
            `;

            const data: insertedRecord = await this.database.query(sql, [name, productTypeId, userId, fileUrl]);

            return [data['insertId']];
        } catch (e) {
            throw e;
        }
    }

    public async getOne(params: any) {
        try {
            const {id} = params;

            const sql = `
                SELECT 
                  p.id,
                  p.name,
                  p.url,
                  pt.name AS category,
                  pt.id AS category_id
                FROM
                  product p 
                  INNER JOIN product_type pt 
                    ON 1 = 1 
                    AND p.product_type_id = pt.id 
                WHERE 1 = 1 
                  AND p.is_active = 1 
                  AND p.id = ?
            `;

            const data: any = await this.database.query(sql, [id]);

            return data;
        } catch (e) {
            throw e;
        }
    }

    public async get() {
        try {
            const sql = `
                SELECT 
                  p.id,
                  p.name,
                  p.url,
                  pt.name AS category,
                  pt.id AS category_id
                FROM
                  product p 
                  INNER JOIN product_type pt 
                    ON 1 = 1 
                    AND p.product_type_id = pt.id 
                WHERE 1 = 1 
                  AND p.is_active = 1 
            `;

            const data: any = await this.database.query(sql);

            return data;
        } catch (e) {
            console.log('error', e);
            throw e;
        }
    }

    public async getAllProductTypes() {
        try {
            const sql = `
                SELECT 
                  pt.*
                FROM
                  product_type pt
            `;

            const data: any = await this.database.query(sql);

            return data;
        } catch (e) {
            console.log('error', e);
            throw e;
        }
    }

    public async deleteProduct(data: any) {
        try {
            const {id} = data;

            const sql = `
                UPDATE product 
                    SET is_active = 0
                WHERE id = ?
            `;

            const result: any = await this.database.query(sql, [id], true);

            return result;
        } catch (e) {
            console.log('error', e);
            throw e;
        }
    }

    public async update(data: any) {
        try {
            let image = null;
            let updateImageCondition = '';

            const {
                id,
                name,
                product_type_id: productTypeId,
            } = data.body;

            if (ValidationUtility.objectChecker(data,['files', 'image'])) {
                image = data.files.image;

                const fileType = image['mimetype'].split('/')[1];
                const newFileName = name + '.' + fileType;

                console.log('HAS image');
                const imagesDirectory = './public/images';
                const fileDir = imagesDirectory + '/' + newFileName;
                const fileUrl = '/images' + '/' + newFileName;

                await image.mv(fileDir);

                updateImageCondition = `url = '${fileUrl}',`;
            }

            const sql = `
                UPDATE product 
                    SET 
                        name = ?,
                        ${updateImageCondition}
                        product_type_id = ?
                WHERE id = ?
            `;

            const result: any = await this.database.query(sql, [name, productTypeId, id], true);

            return result;
        } catch (e) {
            throw e;
        }
    }
}
