const soap = require('soap');
const path = require('path');
module.exports = class AfipWebService {
    constructor(webServiceOptions, options = {}) {
        if (!webServiceOptions) {
            throw new Error('Missing Web Service Object');
        }
        this.soapv12 = webServiceOptions.soapV12 || false;
        this.WSDL = webServiceOptions.WSDL;
        this.URL = webServiceOptions.URL;
        this.WSDL_TEST = webServiceOptions.WSDL_TEST;
        this.URL_TEST = webServiceOptions.URL_TEST;
        this.afip = webServiceOptions.afip;
        this.options = options;
        if (options['generic'] === true) {
            if (typeof options['WSDL'] === 'undefined') {
                throw new Error("WSDL field is required in options");
            }
            if (typeof options['URL'] === 'undefined') {
                throw new Error("URL field is required in options");
            }
            if (typeof options['WSDL_TEST'] === 'undefined') {
                throw new Error("WSDL_TEST field is required in options");
            }
            if (typeof options['URL_TEST'] === 'undefined') {
                throw new Error("URL_TEST field is required in options");
            }
            if (typeof options['service'] === 'undefined') {
                throw new Error("service field is required in options");
            }
            if (this.afip.options['production'] === true) {
                this.WSDL = options['WSDL'];
                this.URL = options['URL'];
            }
            else {
                this.WSDL = options['WSDL_TEST'];
                this.URL = options['URL_TEST'];
            }
            if (typeof options['soapV1_2'] === 'undefined') {
                options['soapV1_2'] = true;
            }
            this.soapv12 = options['soapV1_2'];
        }
        else {
            if (this.afip.options['production']) {
                this.WSDL = path.resolve(__dirname, '../../src/Afip_res', this.WSDL);
            }
            else {
                this.WSDL = path.resolve(__dirname, '../../src/Afip_res', this.WSDL_TEST);
                this.URL = this.URL_TEST;
            }
        }
    }
    async getTokenAuthorization() {
        return this.afip.GetServiceTA(this.options['service']);
    }
    async executeRequest(operation, params = {}) {
        if (!this.soapClient) {
            let soapClientOptions = {
                disableCache: true,
                forceSoap12Headers: this.soapv12
            };
            this.soapClient = await soap.createClientAsync(this.WSDL, soapClientOptions);
            this.soapClient.setEndpoint(this.URL);
        }
        let [result] = await this.soapClient[operation + 'Async'](params);
        return result;
    }
};
//# sourceMappingURL=AfipWebService.js.map