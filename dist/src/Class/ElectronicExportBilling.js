"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AfipWebService = require("./AfipWebService");
class ElectronicExportBilling extends AfipWebService {
    constructor(afip) {
        const options = {
            soapV12: true,
            WSDL: "wsfex-production.wsdl",
            URL: "https://servicios1.afip.gov.ar/wsfexv1/service.asmx",
            WSDL_TEST: "wsfex.wsdl",
            URL_TEST: "https://wswhomo.afip.gov.ar/wsfexv1/service.asmx",
            afip,
        };
        super(options);
    }
    async getLastVoucher(salesPoint, type) {
        var _a;
        const req = {
            Pto_venta: +salesPoint,
            Cbte_Tipo: +type,
        };
        console.log(req);
        const response = (await this.executeRequest("FEXGetLast_CMP", {}, req));
        console.log("lastVersion");
        console.log(response);
        return (_a = response === null || response === void 0 ? void 0 : response.FEXResult_LastCMP) === null || _a === void 0 ? void 0 : _a.Cbte_nro;
    }
    async createVoucher(data, returnResponse = false) {
        const Id = +(await this.getLastId()) + 1;
        const req = {
            Cmp: data,
        };
        req.Cmp.Id = Id;
        if (req.Cmp["Permisos"])
            req.Cmp["Permisos"] = { Permiso: data["Permisos"] };
        if (req.Cmp["Cmps_asoc"])
            req.Cmp["Cmps_asoc"] = { Cmp_asoc: data["Cmps_asoc"] };
        if (req.Cmp["Items"])
            req.Cmp["Items"] = { Item: data["Items"] };
        if (req.Cmp["Opcionales"])
            req.Cmp["Opcionales"] = { Opcional: data["Opcionales"] };
        const results = await this.executeRequest("FEXAuthorize", req);
        if (returnResponse === true) {
            return results;
        }
        else {
            if (Array.isArray(results.FEXResultAuth)) {
                results.FEXResultAuth = results.FEXResultAuth[0];
            }
            return {
                CAE: results.FEXResultAuth.Cae,
                CAEFchVto: this.formatDate(results.FEXResultAuth.Fch_venc_Cae),
            };
        }
    }
    async createNextVoucher(data) {
        const lastVoucher = await this.getLastVoucher(data["Punto_vta"], data["Cbte_Tipo"]);
        const voucherNumber = (+lastVoucher || 0) + 1;
        data["Cbte_nro"] = voucherNumber;
        console.log("data2");
        console.log(data);
        let res = await this.createVoucher(data);
        res["voucherNumber"] = voucherNumber;
        return res;
    }
    async getVoucherInfo(number, salesPoint, type) {
        const req = {
            Cmp: {
                Cbte_nro: number,
                Punto_vta: salesPoint,
                Cbte_Tipo: type,
            },
        };
        const result = await this.executeRequest("FEXGetCMP", req).catch((err) => {
            if (err.code === 1020) {
                return null;
            }
            else {
                throw err;
            }
        });
        return result.ResultGet;
    }
    async getLastId() {
        return (await this.executeRequest("FEXGetLast_ID")).FEXResultGet.Id;
    }
    async getCurrencies() {
        return (await this.executeRequest("FEXGetPARAM_MON")).FEXResultGet
            .ClsFEXResponse_Mon;
    }
    async getExportTypes() {
        return (await this.executeRequest("FEXGetPARAM_Tipo_Expo")).FEXResultGet
            .ClsFEXResponse_Tex;
    }
    async getUnits() {
        return (await this.executeRequest("FEXGetPARAM_UMed")).FEXResultGet
            .ClsFEXResponse_UMed;
    }
    async getLanguage() {
        return (await this.executeRequest("FEXGetPARAM_Idiomas")).FEXResultGet
            .ClsFEXResponse_Idi;
    }
    async getCountries() {
        return (await this.executeRequest("FEXGetPARAM_DST_pais")).FEXResultGet
            .ClsFEXResponse_DST_pais;
    }
    async getIncoterms() {
        return (await this.executeRequest("FEXGetPARAM_Incoterms")).FEXResultGet
            .ClsFEXResponse_Inc;
    }
    async getCUITsOfCountries() {
        return (await this.executeRequest("FEXGetPARAM_DST_CUIT")).FEXResultGet
            .ClsFEXResponse_DST_cuit;
    }
    async getQuoteCurrency(moneyId) {
        const req = {
            Mon_id: moneyId,
        };
        const result = await this.executeRequest("FEXGetPARAM_Ctz", req).catch((err) => {
            throw err;
        });
        return result.FEXResultGet;
    }
    async getSalesPointsValids() {
        return (await this.executeRequest("FEXGetPARAM_PtoVenta")).FEXResultGet
            .ClsFEXResponse_PtoVenta;
    }
    async getOptionsTypes() {
        return (await this.executeRequest("FEXGetPARAM_Opcionales")).FEXResultGet
            .ClsFEXResponse_Opc;
    }
    async verifyPermissionExistenceCountryById(permissionId, countryId) {
        const req = {
            ID_Permiso: permissionId,
            Dst_merc: countryId,
        };
        const result = await this.executeRequest("FEXCheck_Permiso", req).catch((err) => {
            throw err;
        });
        return result.ResultGet;
    }
    async getServerStatus() {
        return await this.executeRequest("FEXDummy");
    }
    formatDate(date) {
        return date
            .toString()
            .replace(/(\d{4})(\d{2})(\d{2})/, (string, year, month, day) => `${year}-${month}-${day}`);
    }
    async executeRequest(operation, params = {}, authData = {}) {
        Object.assign(params, await this.getWSInitialRequest(operation, authData));
        const results = await super.executeRequest(operation, params);
        await this._checkErrors(operation, results);
        return results[operation + "Result"];
    }
    async getWSInitialRequest(operation, authData) {
        if (operation === "FEDummy") {
            return {};
        }
        const { token, sign } = await this.afip.GetServiceTA("wsfex");
        return {
            Auth: Object.assign({ Token: token, Sign: sign, Cuit: this.afip.CUIT }, authData),
        };
    }
    async _checkErrors(operation, results) {
        const res = results[operation + "Result"];
        if (res.FEXErr) {
            const err = Array.isArray(res.FEXErr) ? res.FEXErr[0] : res.FEXErr;
            if (+err.ErrCode !== 0)
                throw new Error(`(${err.ErrCode}) ${err.ErrMsg}`);
        }
    }
}
exports.default = ElectronicExportBilling;
//# sourceMappingURL=ElectronicExportBilling.js.map