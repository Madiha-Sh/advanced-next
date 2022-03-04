import { ParsedUrlQuery } from "querystring";
import { CarModel } from "../../api/Car";
import getAsString from "../getAsString";
import { openDB } from "../openDB";

const mainQuery = `
    FROM car
    WHERE (@make is NULL OR @make = make)
    AND (@model is NULL OR @model = model)
    AND (@min is NULL OR @min <= price)
    AND (@max is NULL OR @max >= price)
`

export async function getPaginatedCars(query: ParsedUrlQuery) {
    const db = await openDB();

    const page = getValueNum(query.page) || 1;
    const rowsPerPage = getValueNum(query.rowsPerPage) || 4;
    const offset = (page-1)*rowsPerPage;

    const dbParams = {
        '@make': getValueStr(query.make),
        '@model': getValueStr(query.model),
        '@min': getValueNum(query.min),
        '@max': getValueNum(query.max), 
    }

    const carsPromise = db.all<CarModel[]>(
        `SELECT * ${mainQuery} LIMIT @rowsPerPage OFFSET @offset`
        , {
            ...dbParams,
            '@rowsPerPage': rowsPerPage,
            '@offset': offset
        }
    );
    
    const totalRowsPromise = db.get<{count: number}>(
        `SELECT count(*) as count ${mainQuery}`
        , { ...dbParams}
    );

    const [cars, totalRows] = await Promise.all([carsPromise, totalRowsPromise]);

    return {cars, totalPages: Math.ceil(totalRows.count/rowsPerPage) };
}

function getValueStr(value: string | string[]) {
    let str = getAsString(value);
    return !str || str.toLowerCase() === 'all' || str.toLowerCase() === 'none' ? null : str;
}

function getValueNum(value: string | string[]) {
    const str = getValueStr(value);
    const num = parseInt(str);
    return isNaN(num) ? null : num;
}