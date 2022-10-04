"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AfipWebService = require('./AfipWebService');
class ElectronicExportBilling extends AfipWebService {
    constructor(afip) {
        const options = {
            soapV12: true,
            WSDL: 'wsfex-production.wsdl',
            URL: 'https://servicios1.afip.gov.ar/wsfexv1/service.asmx',
            WSDL_TEST: 'wsfex.wsdl',
            URL_TEST: 'https://wswhomo.afip.gov.ar/wsfexv1/service.asmx',
            afip
        };
        super(options);
    }
    async getLastVoucher(salesPoint, type) {
        const req = {
            'Pto_venta': salesPoint,
            'Cbte_Tipo': type
        };
        return (await this.executeRequest('FEXGetLast_CMP', req)).Cbte_nro;
    }
    async createVoucher(data, returnResponse = false) {
        const Id = await this.getLastId();
        const req = {
            'Cmp': Object.assign({ 'Id': Id }, data)
        };
        if (data['Permisos'])
            data['Permisos'] = { 'Permiso': data['Permisos'] };
        if (data['Cmps_asoc'])
            data['Cmps_asoc'] = { 'Cmp_asoc': data['Cmps_asoc'] };
        if (data['Items'])
            data['Items'] = { 'Item': data['Items'] };
        if (data['Opcionales'])
            data['Opcionales'] = { 'Opcional': data['Opcionales'] };
        const results = await this.executeRequest('FEXAuthorize', req);
        if (returnResponse === true) {
            return results;
        }
        else {
            if (Array.isArray(results.FEXAuthorizeResponse.FEXResultAuth)) {
                results.FEXAuthorizeResponse.FEXResultAuth = results.FEXAuthorizeResponse.FEXResultAuth[0];
            }
            return {
                'CAE': results.FEXAuthorizeResponse.FEXResultAuth.Cae,
                'CAEFchVto': this.formatDate(results.FEXAuthorizeResponse.FEXResultAuth.Fch_venc_Cae),
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
            'Cmp': {
                'Cbte_nro': number,
                'Punto_vta': salesPoint,
                'Cbte_Tipo': type
            }
        };
        const result = await this.executeRequest('FEXGetCMP', req)
            .catch(err => { if (err.code === 1020) {
            return null;
        }
        else {
            throw err;
        } });
        return result.ResultGet;
    }
    async getLastId() {
        return (await this.executeRequest('FEXGetLast_ID')).FEXResultGet.Id;
    }
    async getCurrencies() {
        return (await this.executeRequest('FEXGetPARAM_MON')).FEXResultGet.ClsFEXResponse_Mon;
    }
    async getExportTypes() {
        return (await this.executeRequest('ClsFEXResponse_Tex')).FEXResultGet.ClsFEXResponse_Mon;
    }
    async getUnits() {
        return (await this.executeRequest('FEXGetPARAM_UMed')).FEXResultGet.ClsFEXResponse_UMed;
    }
    async getLanguage() {
        return (await this.executeRequest('FEXGetPARAM_Idiomas')).FEXResultGet.ClsFEXResponse_Idi;
    }
    async getCountries() {
        return (await this.executeRequest('FEXGetPARAM_DST_pais')).FEXResultGet.ClsFEXResponse_DST_pais;
    }
    async getIncoterms() {
        return (await this.executeRequest('FEXGetPARAM_Incoterms')).FEXResultGet.ClsFEXResponse_Inc;
    }
    async getCUITsOfCountries() {
        return (await this.executeRequest('FEXGetPARAM_DST_CUIT')).FEXResultGet.ClsFEXResponse_DST_cuit;
    }
    async getQuoteCurrencyByMoneyId(moneyId) {
        const req = {
            'Mon_id': moneyId
        };
        const result = await this.executeRequest('FEXGetPARAM_Ctz', req)
            .catch(err => { throw err; });
        return result.ResultGet;
    }
    async getSalesPointsValids() {
        return (await this.executeRequest('FEXGetPARAM_PtoVenta')).FEXResultGet.ClsFEXResponse_PtoVenta;
    }
    async getOptionsTypes() {
        return (await this.executeRequest('FEXGetPARAM_Opcionales')).FEXResultGet.ClsFEXResponse_Opc;
    }
    async verifyPermissionExistenceCountryById(permissionId, countryId) {
        const req = {
            'ID_Permiso': permissionId,
            'Dst_merc': countryId
        };
        const result = await this.executeRequest('FEXCheck_Permiso', req)
            .catch(err => { throw err; });
        return result.ResultGet;
    }
    async getServerStatus() {
        return await this.executeRequest('FEXDummy');
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
        const { token, sign } = await this.afip.GetServiceTA('wsfex');
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
        if (res.FEXErr) {
            const err = Array.isArray(res.FEXErr) ? res.FEXErr[0] : res.FEXErr;
            if (+err.ErrCode !== 0)
                throw new Error(`(${err.ErrCode}) ${err.ErrMsg}`);
        }
    }
}
exports.default = ElectronicExportBilling;
//# sourceMappingURL=ElectronicExportBilling.js.map