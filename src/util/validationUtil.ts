import {isDate} from "node:util/types";
import {fetchBCCRWebService} from "./requestUtil";
import {parseXMLStringToJSON} from "./responseUtil";

const BCCR_ERROR_TAG = 'Error'

/**
 * Utilitarian procedure that validates credentials given by the user with a dummy request to BCCR web service.
 * @param email Email registered before BCCR for web service.
 * @param token Access token given by BCCR for web service.
 */
export const validateCredentials = (email: string, token: string) : void => {
    // Target dummy data definition and formatting.
    const formattedDummyDate : string = new Date().toLocaleDateString('es-ES', {timeZone: 'UTC'})
    // Dummy request and checks if error tag is present in the response.
    fetchBCCRWebService('318', formattedDummyDate, formattedDummyDate, 'N', email, token)
        .then(response => response.text())
        .then(txt => {
            try{
                parseXMLStringToJSON(txt)
            }catch{
                throw new Error('Bad credentials. Email or token (or both) rejected by BCCR web service.')
            }
        })

}

/**
 * Utilitarian function that checks BCCRWebService constructor method parameters integrity.
 * @param email Email registered before BCCR for web service.
 * @param token Access token given by BCCR for web service.
 */
export const validateConstructorParameters = (email: string, token:string) : void => {
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