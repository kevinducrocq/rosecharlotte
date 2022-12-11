import expressAsyncHandler from 'express-async-handler';
import { isAuth } from '../utils.js';
import express from "express";
import fetch from 'node-fetch';
import md5 from "md5";
import {XMLParser} from "fast-xml-parser";

const MR_WebSiteId = "CC22JJ8E";
const MR_WebSiteKey = "f4amtXoL";

const mondialRelayRouter = express.Router();

mondialRelayRouter.get(
  '/:postalCode',
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    const parser = new XMLParser();

    let params = {
      'Enseigne': MR_WebSiteId,
      'Pays': "FR",
      'CP': req.params.postalCode,
      'DelaiEnvoi': "0",
      'RayonRecherche': "20",
      'NombreResultats': "20",
    }

    let code = '';
    for (let key in params) {
      code += params[key];
    }
    code += MR_WebSiteKey;
    params.Security = md5(code).toUpperCase();

    let formattedParams = [];
    for (let key in params) {
      formattedParams.push(`<${key}>${params[key]}</${key}>`);
    }

    const response = await fetch('http://api.mondialrelay.com/Web_Services.asmx', {
      method: 'post',
      headers: {'Content-Type': 'application/soap+xml; charset=utf-8'},
      body: '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">\n' +
        '  <soap12:Body>\n' +
        '    <WSI2_RecherchePointRelais xmlns="http://www.mondialrelay.fr/webservice/">\n' +
        '       '+formattedParams.join('\n') +
        '    </WSI2_RecherchePointRelais>\n' +
        '  </soap12:Body>\n' +
        '</soap12:Envelope>',
    });

    const body = await response.text();
    res.send(parser.parse(body)?.['soap:Envelope']?.['soap:Body']?.['WSI2_RecherchePointRelaisResponse']?.['WSI2_RecherchePointRelaisResult'] ?? []);
  })
);

export default mondialRelayRouter;
