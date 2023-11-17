const AfipWebService = require('./AfipWebService');
module.exports = class ElectronicBilling extends AfipWebService {
    constructor(afip) {
        const options = {
            soapV12: true,
            WSDL: 'wsfe-production.wsdl',
            URL: 'https://servicios1.afip.gov.ar/wsfev1/service.asmx',
            WSDL_TEST: 'wsfe.wsdl',
            URL_TEST: 'https://wswhomo.afip.gov.ar/wsfev1/service.asmx',
            afip
        };
        super(options);
    }
    async getLastVoucher(salesPoint, type) {
        const req = {
            'PtoVta': salesPoint,
            'CbteTipo': type
        };
        return (await this.executeRequest('FECompUltimoAutorizado', req)).CbteNro;
    }
    async createVoucher(data, returnResponse = false) {
        const req = {
            'FeCAEReq': {
                'FeCabReq': {
                    'CantReg': data['CbteHasta'] - data['CbteDesde'] + 1,
                    'PtoVta': data['PtoVta'],
                    'CbteTipo': data['CbteTipo']
                },
                'FeDetReq': {
                    'FECAEDetRequest': data
                }
            }
        };
        delete data['CantReg'];
        delete data['PtoVta'];
        delete data['CbteTipo'];
        if (data['Tributos'])
            data['Tributos'] = { 'Tributo': data['Tributos'] };
        if (data['Iva'])
            data['Iva'] = { 'AlicIva': data['Iva'] };
        if (data['CbtesAsoc'])
            data['CbtesAsoc'] = { 'CbteAsoc': data['CbtesAsoc'] };
        if (data['Compradores'])
            data['Compradores'] = { 'Comprador': data['Compradores'] };
        if (data['Opcionales'])
            data['Opcionales'] = { 'Opcional': data['Opcionales'] };
        const results = await this.executeRequest('FECAESolicitar', req);
        if (returnResponse === true) {
            return results;
        }
        else {
            console.log("NOTIFICACIÓN");
            console.log(results);
            if (Array.isArray(results.FeDetResp.FECAEDetResponse)) {
                results.FeDetResp.FECAEDetResponse = results.FeDetResp.FECAEDetResponse[0];
            }
            return {
                'CAE': results.FeDetResp.FECAEDetResponse.CAE,
                'CAEFchVto': this.formatDate(results.FeDetResp.FECAEDetResponse.CAEFchVto),
            };
        }
    }
    async createNextVoucher(data) {
        const lastVoucher = await this.getLastVoucher(data['PtoVta'], data['CbteTipo']);
        const voucherNumber = lastVoucher + 1;
        data['CbteDesde'] = voucherNumber;
        data['CbteHasta'] = voucherNumber;
        let res = await this.createVoucher(data);
        res['voucherNumber'] = voucherNumber;
        return res;
    }
    async getVoucherInfo(number, salesPoint, type) {
        const req = {
            'FeCompConsReq': {
                'CbteNro': number,
                'PtoVta': salesPoint,
                'CbteTipo': type
            }
        };
        const result = await this.executeRequest('FECompConsultar', req)
            .catch(err => { if (err.code === 602) {
            return null;
        }
        else {
            throw err;
        } });
        return result.ResultGet;
    }
    async getSalesPoints() {
        return (await this.executeRequest('FEParamGetPtosVenta')).ResultGet.PtoVenta;
    }
    async getVoucherTypes() {
        return (await this.executeRequest('FEParamGetTiposCbte')).ResultGet.CbteTipo;
    }
    async getConceptTypes() {
        return (await this.executeRequest('FEParamGetTiposConcepto')).ResultGet.ConceptoTipo;
    }
    async getDocumentTypes() {
        return (await this.executeRequest('FEParamGetTiposDoc')).ResultGet.DocTipo;
    }
    async getAliquotTypes() {
        return (await this.executeRequest('FEParamGetTiposIva')).ResultGet.IvaTipo;
    }
    async getCurrenciesTypes() {
        return (await this.executeRequest('FEParamGetTiposMonedas')).ResultGet.Moneda;
    }
    async getOptionsTypes() {
        return (await this.executeRequest('FEParamGetTiposOpcional')).ResultGet.OpcionalTipo;
    }
    async getTaxTypes() {
        return (await this.executeRequest('FEParamGetTiposTributos')).ResultGet.TributoTipo;
    }
    async getServerStatus() {
        return await this.executeRequest('FEDummy');
    }
    formatDate(date) {
        return date.toString()
            .replace(/(\d{4})(\d{2})(\d{2})/, (string, year, month, day) => `${year}-${month}-${day}`);
    }
    async executeRequest(operation, params = {}) {
        Object.assign(params, await this.getWSInitialRequest(operation));
        const results = await super.executeRequest(operation, params);
        await this._checkErrors(operation, results);
        return results[operation + 'Result'];
    }
    async getWSInitialRequest(operation) {
        if (operation === 'FEDummy') {
            return {};
        }
        const { token, sign } = await this.afip.GetServiceTA('wsfe');
        return {
            'Auth': {
                'Token': token,
                'Sign': sign,
                'Cuit': this.afip.CUIT
            }
        };
    }
    async _checkErrors(operation, results) {
        const res = results[operation + 'Result'];
        console.log("CHEQUEANDO ERRORES");
        console.log(res);
        if (operation === 'FECAESolicitar' && res.FeDetResp) {
            if (Array.isArray(res.FeDetResp.FECAEDetResponse)) {
                res.FeDetResp.FECAEDetResponse = res.FeDetResp.FECAEDetResponse[0];
            }
            if (res.FeDetResp.FECAEDetResponse.Observaciones && res.FeDetResp.FECAEDetResponse.Resultado !== 'A') {
                res.Errors = { Err: res.FeDetResp.FECAEDetResponse.Observaciones.Obs };
            }
        }
        if (res.Errors) {
            const err = Array.isArray(res.Errors.Err) ? res.Errors.Err[0] : res.Errors.Err;
            throw new Error(`(${err.Code}) ${err.Msg}`);
        }
    }
};
//# sourceMappingURL=ElectronicBilling.js.map