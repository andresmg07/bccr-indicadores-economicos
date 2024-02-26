import {getResponseLength} from "./responseUtil";

/**
 * Utilitarian function that fetches BCCR web service.
 * @param code Unique code corresponding to an BCCR financial indicator.
 * @param startDate Request range start date.
 * @param endDate Request range end date.
 * @param compound Retrieve nested data flag.
 * @param email Email registered before BCCR for web service.
 * @param token Access token given by BCCR for web service.
 */
export const fetchBCCRWebService = (code: string, startDate: string, endDate: string, compound: string, email: string, token: string) : Promise<Response> => {
    return new Promise( async (resolve, reject) => {
        // Request parameters string construction.
        const params: string = `/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML?Indicador=${code}&FechaInicio=${startDate}&FechaFinal=${endDate}&Nombre=N&SubNiveles=${compound}&CorreoElectronico=${email}&Token=${token}`
        try{
            resolve(await fetch('https://gee.bccr.fi.cr' + params));
        }catch (e){
            reject(e)
        }
    })
}

/**
 * Utilitarian recursive function that fetches BCCR web service looking for the date of current the current value for a given indicator code. Latest value available.
 * @param code Unique code corresponding to an BCCR financial indicator.
 * @param targetDate Changing date parameter through recursion. This parameter is decreased util valid date is found.
 * @param email Email registered before BCCR for web service.
 * @param token Access token given by BCCR for web service.
 */
export const fetchCurrentValueDate = (code : string, targetDate : Date = new Date(), email: string, token: string) : Promise<Date> => {
    return new Promise(resolve => {
        const formattedTargetDate: string = targetDate.toLocaleDateString('es-ES', {timeZone: 'UTC'})
        // BCCR web service request.
        fetchBCCRWebService(code, formattedTargetDate, formattedTargetDate, 'N', email, token)
            .then(res => res.text())
            .then(txt => {
                if(getResponseLength(txt) !== 0){
                    resolve(targetDate)
                }else{
                    // Parameter date decrement.
                    targetDate.setDate(targetDate.getDate() - 1)
                    // Recursive call.
                    resolve(fetchCurrentValueDate(code, targetDate, email, token))
                }
            })
    })
}
