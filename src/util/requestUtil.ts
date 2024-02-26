import {getResponseLength} from "./responseUtil";

/**
 *
 * @param host
 * @param code
 * @param startDate
 * @param endDate
 * @param compound
 * @param email
 * @param token
 */
export const fetchBCCRWebService = (host: string, code: string, startDate: string, endDate: string, compound: string, email: string, token: string) : Promise<Response> => {
    return new Promise( async (resolve, reject) => {
        // Request parameters string construction
        const params: string = `/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicos?Indicador=${code}&FechaInicio=${startDate}&FechaFinal=${endDate}&Nombre=N&SubNiveles=${compound}&CorreoElectronico=${email}&Token=${token}`
        try{
            // Data retrieval and formatting.
            resolve(await fetch(host + params));
        }catch (e){
            reject(e)
        }
    })
}

/**
 *
 * @param host
 * @param code
 * @param targetDate
 * @param email
 * @param token
 */
export const getLastAvailableDate = (host: string, code : string, targetDate : Date = new Date(), email: string, token: string) : Promise<Date> => {
    return new Promise(resolve => {
        const formattedTargetDate: string = targetDate.toLocaleDateString('es-ES', {timeZone: 'UTC'})
        // BCCR web service request.
        fetchBCCRWebService(host, code, formattedTargetDate, formattedTargetDate, 'N', email, token)
            .then(res => res.text())
            .then(txt => {
                if(getResponseLength(txt) !== 0){
                    resolve(targetDate)
                }else{
                    // Parameter date decrement.
                    targetDate.setDate(targetDate.getDate() - 1)
                    // Recursive call.
                    resolve(getLastAvailableDate(host, code, targetDate, email, token))
                }
            })
    })
}
