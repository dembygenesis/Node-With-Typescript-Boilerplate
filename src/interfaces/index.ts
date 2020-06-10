import {Application} from "express";

export interface Database {
    numberOfConnections: number;
}

export interface ApplicationWithValidations extends Application {
    hello(): any,
}
