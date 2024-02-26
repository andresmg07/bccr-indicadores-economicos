import {isDate, isStringObject} from "node:util/types";

/**
 * Utilitarian function that checks BCCRWebService constructor method parameters integrity.
 * @param email Email registered before BCCR for web service.
 * @param token Access token given by BCCR for web service.
 */
export const validateConstructor = (email: string, token:string) : void => {
    if(!email.length){
        throw new Error('Found empty string as email constructor parameter. This parameter must be an string containing a valid email address.')
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
    if(!code.length){
        throw new Error('Found empty string as indicator code parameter. This parameter must be an string containing a numerical value.')
    }
    if(isNaN(Number(code))){
        throw new Error('Indicator code parameter must be an string containing a numerical value.')
    }
    if(!isDate(startDate) && endDate){
        throw new Error('To retrieve time ranged indicators startDate parameter must be given as a Date object instance.')
    }
    if(!isDate(endDate) && startDate){
        throw new Error('To retrieve time ranged indicators endDate parameter must be given as a Date object instance.')
    }
    if(startDate && endDate){
        if( startDate > new Date() || endDate > new Date()){
            throw new Error('endDate parameter nor startDate can be dates in the future.')
        }
        if( startDate > endDate){
            throw new Error('endDate parameter must greater than startDate.')
        }
    }


}