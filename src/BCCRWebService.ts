import {getResponseData} from "./util/responseUtil";
import {DataPoint} from "./types/BCCR.types";
import {
    validateConstructorParameters,
    validateCredentials,
    validateRequestParameters
} from "./util/validationUtil";
import {fetchBCCRWebService, fetchCurrentValueDate} from "./util/requestUtil";


module.exports = class BCCRWebService {
    // Email registered before BCCR for web service.
    private readonly email: string;
    // Access token given by BCCR for web service.
    private readonly token: string;

    /**
     * Constructor method for BCCR web service consumption class.
     * @param email Email registered before BCCR for web service.
     * @param token Access token given by BCCR for web service.
     */
    constructor(email: string, token: string) {
        validateConstructorParameters(email, token)
        validateCredentials(email, token)
        this.email = email
        this.token = token
    }

    /**
     * Method that manages BCCR indicator web service fetch logic.
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
            // Control sequence structure that checks if startDate and endDate provided
            if(startDate && endDate){
                // When startDate and endDate ARE provided values are formatted into locale string and assigned to corresponding variables.
                formattedStartDate = startDate.toLocaleDateString('es-ES', {timeZone: 'UTC'})
                formattedEndDate = endDate.toLocaleDateString('es-ES', {timeZone: 'UTC'})
            }else{
                // When startDate and endDate are NOT provided target date is fetched and its result is formatted into locale string and assigned to corresponding variables.
                const formattedTargetDate = (await fetchCurrentValueDate(code, new Date(), this.email, this.token)).toLocaleDateString('es-ES', {timeZone: 'UTC'})
                formattedStartDate = formattedTargetDate
                formattedEndDate = formattedTargetDate
            }
            // Boolean compound property conversion into request compatible format.
            const formattedCompound: string = compound ? 'S' : 'N'
            // BCCR web service data retrieval and response formatting.
            fetchBCCRWebService(code, formattedStartDate, formattedEndDate, formattedCompound, this.email, this.token)
                .then(response => getResponseData(response))
                .then(data => resolve(data))
                .catch(e => reject(e))
        })
    }


}
