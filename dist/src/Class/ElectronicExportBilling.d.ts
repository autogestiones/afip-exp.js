import { ICreateVoucherExport } from "./../types";
declare const AfipWebService: any;
export default class ElectronicExportBilling extends AfipWebService {
    constructor(afip: any);
    getLastVoucher(salesPoint: any, type: any): Promise<any>;
    createVoucher(data: ICreateVoucherExport, returnResponse?: boolean): Promise<any>;
    createNextVoucher(data: any): Promise<any>;
    getVoucherInfo(number: any, salesPoint: any, type: any): Promise<any>;
    getLastId(): Promise<any>;
    getCurrencies(): Promise<any>;
    getExportTypes(): Promise<any>;
    getUnits(): Promise<any>;
    getLanguage(): Promise<any>;
    getCountries(): Promise<any>;
    getIncoterms(): Promise<any>;
    getCUITsOfCountries(): Promise<any>;
    getQuoteCurrency(moneyId: any): Promise<any>;
    getSalesPointsValids(): Promise<any>;
    getOptionsTypes(): Promise<any>;
    verifyPermissionExistenceCountryById(permissionId: any, countryId: any): Promise<any>;
    getServerStatus(): Promise<any>;
    formatDate(date: any): any;
    executeRequest(operation: any, params?: {}, authData?: {}): Promise<any>;
    getWSInitialRequest(operation: any, authData: any): Promise<{
        Auth?: undefined;
    } | {
        Auth: any;
    }>;
    _checkErrors(operation: any, results: any): Promise<void>;
}
export {};
