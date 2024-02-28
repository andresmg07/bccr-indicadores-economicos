import { parseString } from "xml2js";
import { DataPoint } from "../types/BCCR.types";

const BCCR_VALUE_TAG: string = "NUM_VALOR";
const BCCR_DATE_TAG: string = "DES_FECHA";
const BCCR_CODE_TAG: string = "COD_INDICADORINTERNO";

/**
 * Utilitarian function that fetches the first child node value on XML structured text that matches with a specific tag name.
 * @param response XML structured text.
 * @param tagName Target tag name to fetch.
 */
const getSingleValueByTagName = (response: string, tagName: string): string => {
    try {
        return parseXMLStringToJSON(response)[0][tagName][0];
    } catch (e) {
        throw new Error(
            "Error while extracting value from single indicator data point.",
        );
    }
};

/**
 * Utilitarian function that fetches all node values on XML structured text that matches with a specific tag name.
 * @param response XML structured text.
 * @param tagName Target tag name to fetch.
 */
const getValuesByTagName = (response: string, tagName: string): any[] => {
    try {
        return parseXMLStringToJSON(response).map((node) => node[tagName][0]);
    } catch (e) {
        throw new Error(
            "Error while extracting values from indicator data set.",
        );
    }
};

/**
 * Utilitarian function that parses an XML formatted string into a JSON.
 * @param XMLString
 */
export const parseXMLStringToJSON = (XMLString: string): any[] => {
    // Parse result temp variable.
    let parseResult: any[] = [];
    // First level of parsing. This extract the superficial structure of BCCR XML response.
    parseString(XMLString, (partialErr, partialResult) => {
        if (partialErr) {
            throw new Error("Error while parsing BCCR web service response.");
        }
        // Second level of parsing. This extract the data set.
        parseString(
            partialResult.string["_"],
            (jsonParsedErr, jsonParsedResult) => {
                if (jsonParsedErr) {
                    throw new Error(
                        "Error while parsing BCCR web service response.",
                    );
                }
                // Parse result temp variable assignation.
                parseResult =
                    jsonParsedResult.Datos_de_INGC011_CAT_INDICADORECONOMIC
                        .INGC011_CAT_INDICADORECONOMIC;
            },
        );
    });
    return parseResult;
};

/**
 * Utilitarian function that counts the number of valid data points in XML structured text.
 * @param response XML structured text.
 */
export const getResponseLength = (response: string): number => {
    try {
        return parseXMLStringToJSON(response).length;
    } catch (e) {
        throw new Error(
            "Empty response from BCCR web service. Validate indicator code, publication periodicity and indicator structure (compound or simple).",
        );
    }
};

/**
 * Utilitarian function that extract a data point from a XML formatted response.
 * @param dataPoint XML structured text containing target data point.
 */
const getDataPoint = (dataPoint: string): DataPoint => {
    return {
        code: getSingleValueByTagName(dataPoint, BCCR_CODE_TAG),
        date: getSingleValueByTagName(dataPoint, BCCR_DATE_TAG),
        value: parseFloat(getSingleValueByTagName(dataPoint, BCCR_VALUE_TAG)),
    };
};

/**
 * Utilitarian function that extract a data set from a XML formatted response.
 * @param dataSet XML structured text containing target data set.
 */
const getDataSet = (dataSet: string): DataPoint[] => {
    // Definition of temporal result data structure.
    let targetDataSet = [];

    // Retrieval target of values
    const codes = getValuesByTagName(dataSet, BCCR_CODE_TAG);
    const dates = getValuesByTagName(dataSet, BCCR_DATE_TAG);
    const values = getValuesByTagName(dataSet, BCCR_VALUE_TAG);

    // Collapse of retrieved target values into list of objects.
    for (let i = 0; i < getResponseLength(dataSet); i++) {
        targetDataSet.push({
            code: codes[i],
            date: dates[i],
            value: parseFloat(values[i]),
        });
    }

    return targetDataSet;
};

/**
 * Utilitarian function for data extraction from BCCR web service response. This function handle single and multiple value responses.
 * @param res  BCCR web service response.
 */
export const getResponseData = (
    res: Response,
): Promise<DataPoint | DataPoint[]> => {
    return new Promise((resolve, reject) => {
        res.text()
            .then((txt) => {
                // Check response length to select data handle method.
                if (getResponseLength(txt) === 1) {
                    resolve(getDataPoint(txt));
                } else {
                    resolve(getDataSet(txt));
                }
            })
            .catch((e) => {
                reject(e);
            });
    });
};
