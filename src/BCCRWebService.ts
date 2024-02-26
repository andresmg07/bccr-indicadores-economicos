import {getResponseData} from "./util/responseUtil";
import {DataPoint} from "./types/BCCR.types";
import {validateConstructor, validateRequestParameters} from "./util/validationUtil";
import {fetchBCCRWebService, getLastAvailableDate} from "./util/requestUtil";


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
        validateRequestParameters(code, startDate, endDate)
        return new Promise( async (resolve, reject) => {
            // Date object conversion into request compatible format.
            let formattedStartDate: string
            let formattedEndDate: string
            if(startDate && endDate){
                formattedStartDate = startDate.toLocaleDateString('es-ES', {timeZone: 'UTC'})
                formattedEndDate = endDate.toLocaleDateString('es-ES', {timeZone: 'UTC'})
            }else{
                const formattedTargetDate = (await getLastAvailableDate(this.host, code, new Date(), this.email, this.token)).toLocaleDateString('es-ES', {timeZone: 'UTC'})
                formattedStartDate = formattedTargetDate
                formattedEndDate = formattedTargetDate
            }
            // Boolean compound property conversion into request compatible format.
            const formattedCompound: string = compound ? 'S' : 'N'
            fetchBCCRWebService(this.host, code, formattedStartDate, formattedEndDate, formattedCompound, this.email, this.token)
                .then(response => getResponseData(response))
                .then(data => resolve(data))
                .catch(e => reject(e))
        })
    }


}
