import ElectronicExportBilling from "./Class/ElectronicExportBilling";
export default class Afip {
    options: {};
    ElectronicBilling: any;
    ElectronicExportBilling: ElectronicExportBilling;
    TA_FOLDER: any;
    WSAA_WSDL: any;
    WSAA_URL: any;
    CERT: any;
    PRIVATEKEY: any;
    RES_FOLDER: any;
    CUIT: any;
    constructor(options?: {});
    GetServiceTA: (service: any, firstTry?: boolean) => Promise<any>;
    CreateServiceTA: (service: any) => Promise<void>;
    WebService: (service: any, options: any) => any;
}
