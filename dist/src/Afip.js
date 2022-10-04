"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const soap = require("soap");
const forge = require("node-forge");
const xml2js = require("xml2js");
var xmlParser = new xml2js.Parser({
    normalizeTags: true,
    normalize: true,
    explicitArray: false,
    attrkey: "header",
    tagNameProcessors: [(key) => key.replace("soapenv:", "")],
});
const AfipWebService = require("./Class/AfipWebService");
const ElectronicBilling = require("./Class/ElectronicBilling");
const ElectronicExportBilling_1 = require("./Class/ElectronicExportBilling");
class Afip {
    constructor(options = {}) {
        this.options = {};
        this.GetServiceTA = async function (service, firstTry = true) {
            const taFilePath = path.resolve(this.TA_FOLDER, `TA-${this.options["CUIT"]}-${service}${this.options["production"] ? "-production" : ""}.json`);
            const taFileAccessError = await new Promise((resolve) => {
                fs.access(taFilePath, fs.constants.F_OK, resolve);
            });
            if (!taFileAccessError) {
                const taData = require(taFilePath);
                const actualTime = new Date(Date.now() + 600000);
                const expirationTime = new Date(taData.header[1].expirationtime);
                delete require.cache[require.resolve(taFilePath)];
                if (actualTime < expirationTime) {
                    return {
                        token: taData.credentials.token,
                        sign: taData.credentials.sign,
                    };
                }
            }
            if (firstTry === false) {
                throw new Error("Error getting Token Autorization");
            }
            await this.CreateServiceTA(service).catch((err) => {
                throw new Error(`Error getting Token Autorization ${err}`);
            });
            return await this.GetServiceTA(service, false);
        };
        this.CreateServiceTA = async function (service) {
            const date = new Date();
            const tra = `<?xml version="1.0" encoding="UTF-8" ?>
	<loginTicketRequest version="1.0">
		<header>
			<uniqueId>${Math.floor(date.getTime() / 1000)}</uniqueId>
			<generationTime>${new Date(date.getTime() - 600000).toISOString()}</generationTime>
			<expirationTime>${new Date(date.getTime() + 600000).toISOString()}</expirationTime>
		</header>
		<service>${service}</service>
	</loginTicketRequest>`.trim();
            const certPromise = new Promise((resolve, reject) => {
                fs.readFile(this.CERT, { encoding: "utf8" }, (err, data) => err ? reject(err) : resolve(data));
            });
            const keyPromise = new Promise((resolve, reject) => {
                fs.readFile(this.PRIVATEKEY, { encoding: "utf8" }, (err, data) => err ? reject(err) : resolve(data));
            });
            const [cert, key] = await Promise.all([certPromise, keyPromise]);
            const p7 = forge.pkcs7.createSignedData();
            p7.content = forge.util.createBuffer(tra, "utf8");
            p7.addCertificate(cert);
            p7.addSigner({
                authenticatedAttributes: [
                    {
                        type: forge.pki.oids.contentType,
                        value: forge.pki.oids.data,
                    },
                    {
                        type: forge.pki.oids.messageDigest,
                    },
                    {
                        type: forge.pki.oids.signingTime,
                        value: new Date(),
                    },
                ],
                certificate: cert,
                digestAlgorithm: forge.pki.oids.sha256,
                key: key,
            });
            p7.sign();
            const bytes = forge.asn1.toDer(p7.toAsn1()).getBytes();
            const signedTRA = Buffer.from(bytes, "binary").toString("base64");
            const soapClientOptions = { disableCache: true, endpoint: this.WSAA_URL };
            const soapClient = await soap.createClientAsync(this.WSAA_WSDL, soapClientOptions);
            const loginArguments = { in0: signedTRA };
            const [loginCmsResult] = await soapClient.loginCmsAsync(loginArguments);
            const res = await xmlParser.parseStringPromise(loginCmsResult.loginCmsReturn);
            const taFilePath = path.resolve(this.TA_FOLDER, `TA-${this.options["CUIT"]}-${service}${this.options["production"] ? "-production" : ""}.json`);
            await new Promise((resolve, reject) => {
                fs.writeFile(taFilePath, JSON.stringify(res.loginticketresponse), (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(null);
                });
            });
        };
        this.WebService = function (service, options) {
            options["service"] = service;
            options["generic"] = true;
            return new AfipWebService({ afip: this }, options);
        };
        this.options = options;
        if (!(this instanceof Afip)) {
            return new Afip(options);
        }
        if (!options.hasOwnProperty("CUIT")) {
            throw new Error("CUIT field is required in options array");
        }
        if (!options.hasOwnProperty("production")) {
            options["production"] = false;
        }
        if (!options.hasOwnProperty("cert")) {
            options["cert"] = "cert";
        }
        if (!options.hasOwnProperty("key")) {
            options["key"] = "key";
        }
        if (!options.hasOwnProperty("res_folder")) {
            options["res_folder"] = __dirname + "/Afip_res/";
        }
        if (!options.hasOwnProperty("ta_folder")) {
            options["ta_folder"] = __dirname + "/Afip_res/";
        }
        if (options["production"] !== true) {
            options["production"] = false;
        }
        this.options = options;
        this.CUIT = options["CUIT"];
        this.RES_FOLDER = options["res_folder"];
        this.TA_FOLDER = options["ta_folder"];
        this.CERT = path.resolve(this.RES_FOLDER, options["cert"]);
        this.PRIVATEKEY = path.resolve(this.RES_FOLDER, options["key"]);
        this.WSAA_WSDL = path.resolve(__dirname, "Afip_res/", "wsaa.wsdl");
        if (options["production"]) {
            this.WSAA_URL = "https://wsaa.afip.gov.ar/ws/services/LoginCms";
        }
        else {
            this.WSAA_URL = "https://wsaahomo.afip.gov.ar/ws/services/LoginCms";
        }
        this.ElectronicBilling = new ElectronicBilling(this);
        this.ElectronicExportBilling = new ElectronicExportBilling_1.default(this);
    }
}
exports.default = Afip;
//# sourceMappingURL=Afip.js.map