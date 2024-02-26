import {isDate, isStringObject} from "node:util/types";

/**
 * Utilitarian function that checks BCCRWebService constructor method parameters integrity.
 * @param email Email registered before BCCR for web service.
 * @param token Access token given by BCCR for web service.
 */
export const validateConstructor = (email: string, token:string) : void => {
    if(!isStringObject(email)){
        throw new Error('Email constructor parameter must be an string.')
    }
    if(!email.length){
        throw new Error('Found empty string as email constructor parameter. This parameter must be an string containing a valid email address.')
    }
    if(!isStringObject(token)){
        throw new Error('Token constructor parameter must be an string.')
    }
    if(!token.length){
        throw new Error('Found empty string as token constructor parameter. This parameter must be an string containing an alphanumerical value.')
    }
}

/**
 * Utilitarian function that checks BCCRWebService request method parameters integrity.
 * @param code Unique code corresponding to an BCCR financial indicator.
 * @param startDate Request range start date.
 * @param endDate Request range end date.
 */
export const validateRequestParameters = (code: string, startDate: Date, endDate: Date) : void => {
    if(!isStringObject(code)){
        throw new Error('Code parameter must be an string.')
    }
    if(!code.length){
        throw new Error('Found empty string as indicator code parameter. This parameter must be an string containing a numerical value.')
    }
    if(isNaN(Number(code))){
        throw new Error('Indicator code parameter must be an string containing a numerical value.')
    }
    if(!startDate){
        throw new Error('Start date parameter must be provided to execute request.')
    }
    if(!isDate(startDate)){
        throw new Error('Start date parameter must be a Date object instance.')
    }
    if(!endDate){
        throw new Error('End date parameter must be provided to execute request.')
    }
    if(!isDate(endDate)){
        throw new Error('End date parameter must be a Date object instance.')
    }
    if(startDate > endDate){
        throw new Error('End date parameter must greater than start date.')
    }
}