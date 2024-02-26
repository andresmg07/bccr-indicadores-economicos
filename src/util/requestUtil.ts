import {DOMParser} from "xmldom";
import {DataPoint} from "../types/BCCR.types";

const BCCR_VALUE_TAG: string = "NUM_VALOR"
const BCCR_DATE_TAG: string = "DES_FECHA"
const BCCR_CODE_TAG: string = "COD_INDICADORINTERNO"

/**
 * Utilitarian function that fetches the first child node value on XML structured text that matches with a specific tag name.
 * @param response XML structured text.
 * @param tagName Target tag name to fetch.
 */
const getSingleValueByTagName = (response: string, tagName: string) : string  => {
    const node : Element | null  = new DOMParser().parseFromString(response).documentElement.getElementsByTagName(tagName)[0]
    let nodeValue = ""
    if(node.firstChild && node.firstChild.nodeValue){ nodeValue = node.firstChild.nodeValue }
    return nodeValue
}

/**
 * Utilitarian function that fetches all node values on XML structured text that matches with a specific tag name.
 * @param response XML structured text.
 * @param tagName Target tag name to fetch.
 */
const getValuesByTagName = (response: string, tagName: string) : string[] => {
    const nodes : Element[] = Array.from(new DOMParser().parseFromString(response).documentElement.getElementsByTagName(tagName))
    return nodes.map((node : Element) => {
        let nodeValue = ""
        if(node.firstChild && node.firstChild.nodeValue){ nodeValue = node.firstChild.nodeValue }
        return nodeValue
    })
}

/**
 * Utilitarian function that counts the number of valid data points in XML structured text.
 * @param response XML structured text.
 */
const getResponseLength = (response: string) : number => {
    return new DOMParser().parseFromString(response).documentElement.getElementsByTagName(BCCR_VALUE_TAG).length
}

/**
 * Utilitarian function that extract a data point from a XML formatted response.
 * @param dataPoint XML structured text containing target data point.
 */
const getDataPoint = (dataPoint: string) : DataPoint => {
    return ({
        code: getSingleValueByTagName(dataPoint, BCCR_CODE_TAG),
        date: getSingleValueByTagName(dataPoint, BCCR_DATE_TAG),
        value: parseFloat(getSingleValueByTagName(dataPoint, BCCR_VALUE_TAG)),
    })
}

/**
 * Utilitarian function that extract a data set from a XML formatted response.
 * @param dataSet XML structured text containing target data set.
 */
const getDataSet = (dataSet: string) : DataPoint[] => {

    // Definition of temporal result data structure.
    let targetDataSet = []

    // Retrieval target of values
    const codes = getValuesByTagName(dataSet, BCCR_CODE_TAG)
    const dates = getValuesByTagName(dataSet, BCCR_DATE_TAG)
    const values = getValuesByTagName(dataSet, BCCR_VALUE_TAG)

    // Collapse of retrieved target values into list of objects.
    for(let i = 0; i < getResponseLength(dataSet); i++){
        targetDataSet.push({
            code: codes[i],
            date: dates[i],
            value: parseFloat(values[i]),
        })
    }

    return targetDataSet
}

/**
 * Utilitarian function for data extraction from BCCR web service response. This function handle single and multiple value responses.
 * @param res  BCCR web service response.
 */
export const getResponseData = (res: Response) : Promise<DataPoint | DataPoint[]> => {
    return new Promise((resolve, reject) => {
        res.text().then( (txt : string) => {
            // Check response length to select data extraction method.
            if(getResponseLength(txt) === 1){
                resolve(getDataPoint(txt))
            }else{
                resolve(getDataSet(txt))
            }
        })
            .catch(() => {
                reject(new Error('Error while formatting response.'))
            })
    })
}