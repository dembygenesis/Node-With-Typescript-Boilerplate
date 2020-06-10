export type queryVars = number | string | Array<number | string>;

export type responseBuilder = {
    http_code: number,
    response_msg: any,
    data: any
};

export type slackMessage = {
    channel: string,
    username: string,
    text: string,
    token: string,
};

export type insertedRecord = {
    insertId: number,
};
