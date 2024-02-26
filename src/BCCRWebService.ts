import {getResponseData} from "./util/requestUtil";
import {DataPoint} from "./types/BCCR.types";
import {validateConstructor, validateRequestParameters} from "./util/validationUtil";


module.exports = class BCCRWebService {
    // Email registered before BCCR for web service.
    private readonly email: string;
    // Access token given by BCCR for web service.
    private readonly token: string;
    // BCCR web service domain.
    private readonly host: string;

    /**
     * Constructor method for BCCR web service consumption class.
     * @param email Email registered before BCCR for web service.
     * @param token Access token given by BCCR for web service.
     */
    constructor(email: string, token: string) {
        validateConstructor(email, token)
        this.email = email
        this.token = token
        this.host = 'https://gee.bccr.fi.cr';
    }

    /**
     * Function that fetches from BCCR indicator web service.
     * @param code Unique code corresponding to an BCCR financial indicator.
     * @param startDate Request range start date.
     * @param endDate Request range end date.
     * @param compound Retrieve nested data flag.
     */
    request = (code: string, startDate: Date, endDate: Date, compound: boolean = false) : Promise<DataPoint | DataPoint[]> => {
        validateRequestParameters(code, startDate, endDate, )
        return new Promise( async (resolve, reject) => {
            // Date object conversion into request compatible format.
            const formattedStartDate: string = startDate.toLocaleDateString('es-ES', {timeZone: 'UTC'})
            const formattedEndDate: string = endDate.toLocaleDateString('es-ES', {timeZone: 'UTC'})
            // Boolean compound property conversion into request compatible format.
            const formattedCompound: string = compound ? 'S' : 'N'
            // Request parameters string construction
            const params: string = `/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicos?Indicador=${code}&FechaInicio=${formattedStartDate}&FechaFinal=${formattedEndDate}&Nombre=N&SubNiveles=${formattedCompound}&CorreoElectronico=${this.email}&Token=${this.token}`
            try{
                // Data retrieval and formatting.
                resolve(getResponseData( await fetch(this.host + params)));
            }catch (e){
                reject(e)
            }
        })
    }
}
