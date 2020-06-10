import AuthUtility from '../../utilities/auth';
import StringUtility from "../../utilities/string";

export default class UserService {

    async isNotLastAdmin() {
        try {
            const sql = `
                SELECT 
                    COUNT(*) AS "count"
                FROM user u
                WHERE 1 = 1      
                    AND u.is_active = 1
                    AND u.user_type_id = (SELECT id FROM user_type WHERE name = "Admin")
            `;

            const data: any = await global.database.query(sql);

            const count = parseFloat(data[0]['count']);

            console.log({count});

            return count > 1;
        } catch (e) {
            throw e;
        }
    }

    async getUserTypes() {
        try {
            const sql = `
                SELECT 
                    ut.id,
                    ut.name
                FROM user_type ut
                WHERE 1 = 1      
            `;

            const data = await global.database.query(sql);

            return data;
        } catch (e) {
            throw e;
        }
    }

    async getBankTypes() {
        try {
            const sql = `
                SELECT 
                    bt.id,
                    bt.name
                FROM bank_type bt  
                WHERE 1 = 1      
            `;

            const data = await global.database.query(sql);

            return data;
        } catch (e) {
            throw e;
        }
    }

    async getOne(params: any) {
        try {

            const {
                id
            } = params;

            const sql = `
                SELECT 
                    u.id,
                    u.firstname,
                    u.lastname,
                    u.email,
                    u.mobile_number,
                    ut.name AS role,
                    bt.name AS bank_type,
                    u.bank_no,
                    u.address,
                    u.birthday,
                    u.gender,
                    u.user_type_id,
                    u.bank_type_id,
                    u.m88_account
                FROM user u 
                INNER JOIN user_type ut 
                    ON 1 = 1
                        AND u.user_type_id = ut.id
                INNER JOIN bank_type bt 
                    ON 1 = 1
                        AND u.bank_type_id = bt.id 
                WHERE 1 = 1      
                    and u.is_active = 1
                    and u.id = ?
            `;

            const data = await global.database.query(sql, [id]);

            return data;
        } catch (e) {
            throw e;
        }
    }

    async get() {
        try {
            const sql = `
                SELECT 
                    u.id,
                    u.firstname,
                    u.lastname,
                    u.email,
                    u.mobile_number,
                    ut.name AS role,
                    bt.name AS bank_type,
                    u.bank_no,
                    u.address,
                    u.birthday,
                    u.gender,
                    u.m88_account
                FROM user u 
                INNER JOIN user_type ut 
                    ON 1 = 1
                        AND u.user_type_id = ut.id
                INNER JOIN bank_type bt 
                    ON 1 = 1
                        AND u.bank_type_id = bt.id 
                WHERE 1 = 1      
                    and u.is_active = 1
            `;

            const data = await global.database.query(sql);

            return data;
        } catch (e) {
            throw e;
        }
    }

    async getByEmail(email: string) {
        try {
            const data = await global.database.query('SELECT * FROM user WHERE email = ?', [email]);

            return data;
        } catch (e) {
            throw e;
        }
    }

    async getById(id: string) {
        try {
            const sql = `
                SELECT 
                    u.id,
                    u.firstname,
                    u.lastname,
                    u.email,
                    u.mobile_number,
                    ut.name AS role,
                    bt.name AS bank_type,
                    u.bank_no
                FROM user u 
                INNER JOIN user_type ut 
                    ON 1 = 1
                        AND u.user_type_id = ut.id
                INNER JOIN bank_type bt 
                    ON 1 = 1
                        AND u.bank_type_id = bt.id 
                WHERE 1 = 1     
                    AND u.id = ? 
            `;
            const data = await global.database.query(sql, [id]);

            return data;
        } catch (e) {
            throw e;
        }
    }


    async login(data: any) {
        try {
            const sql = `
                SELECT 
                    u.*,
                    ut.name AS role
                FROM
                user u
                INNER JOIN user_type ut 
                    ON 1 = 1
                        AND u.user_type_id = ut.id 
                WHERE 1 = 1
                    AND email = ?
            `;

            const {email, password} = data;
            const user: any = await global.database.query(sql, [email]);

            const hashedPassword = user[0]['password'];
            const userId = user[0]['id'];

            const passwordValid = await AuthUtility.compareHashed(password, hashedPassword);

            let token: boolean | string = false;

            if (passwordValid) {
                token = AuthUtility.getJWT(userId, StringUtility.getEnv('SECRET'))
            }

            return {
                token,
                userDetails: {
                    firstname: user[0]['firstname'],
                    lastname: user[0]['lastname'],
                    role: user[0]['role'],
                }
            };
        } catch (e) {
            throw e;
        }
    }

    async update(data: any) {
        try {
            const {
                firstname,
                lastname,
                email,
                mobile_number: mobileNumber,
                password,
                user_type_id: userTypeId,
                created_by: createdBy,
                bank_type_id: bankTypeId,
                bank_no: bankNo,
                address,
                birthday,
                m88_account: m88Account,
                gender,
                id,
            } = data;

            const sql = `
                UPDATE user 
                SET 
                    firstname = ?,
                    lastname = ?, 
                    email = ?, 
                    mobile_number = ?, 
                    password = ?, 
                    user_type_id = ?, 
                    bank_type_id = ?, 
                    bank_no = ?, 
                    address = ?,
                    birthday = ?,
                    m88_account = ?,
                    gender = ?
                WHERE id = ?
            `;

            const hashedPassword = await AuthUtility.getHashed(password);

            const result = await global.database.query(sql, [
                firstname,
                lastname,
                email,
                mobileNumber,
                hashedPassword,
                userTypeId,
                bankTypeId,
                bankNo,
                address,
                birthday,
                m88Account,
                gender,
                id,
            ], true);

            return true;
        } catch (e) {
            throw e;
        }
    }

    async add(data: any) {
        try {
            const {
                firstname,
                lastname,
                email,
                mobile_number: mobileNumber,
                password,
                user_type_id: userTypeId,
                created_by: createdBy,
                bank_type_id: bankTypeId,
                bank_no: bankNo,
                address,
                birthday,
                m88_account: m88Account,
                gender,
            } = data;

            const sql = `
                INSERT INTO user (
                    firstname, 
                    lastname, 
                    email, 
                    mobile_number, 
                    password, 
                    user_type_id, 
                    bank_type_id, 
                    bank_no, 
                    address,
                    birthday,
                    m88_account,
                    gender
                )
                VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )
            `;

            const hashedPassword = await AuthUtility.getHashed(password);

            const result = await global.database.query(sql, [
                firstname,
                lastname,
                email,
                mobileNumber,
                hashedPassword,
                userTypeId,
                bankTypeId,
                bankNo,
                address,
                birthday,
                m88Account,
                gender,
            ], true);

            return true;
        } catch (e) {
            throw e;
        }
    }

    async delete(data: any) {
        try {
            const {
                id,
            } = data;

            const sql = `
                UPDATE user
                SET is_active = 0 
                WHERE id = ?
            `;

            const result = await global.database.query(sql, [
                id,
            ], true);

            return true;
        } catch (e) {
            throw e;
        }
    }
}
