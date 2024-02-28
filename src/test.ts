import { DataPoint } from "./types/BCCR.types";
const BCCRWebService = require("./BCCRWebService");

const test = () => {
    const bccr = new BCCRWebService("andresmonterog@hotmail.com", "MOHDSTRRNE");
    const targetDate = new Date(2024, -1);
    console.log(targetDate);
    bccr.request("25633", targetDate, targetDate, true)
        .then((r: DataPoint) => console.log(r))
        .catch((e: Error) => console.log(e));
};

test();
