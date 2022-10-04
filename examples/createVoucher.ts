
const date = new Date(Date.now() - ((new Date()).getTimezoneOffset() * 60000)).toISOString().split('T')[0];

/* const data = {
 Fecha_cbte: null,
 Cbte_Tipo: null,
 Punto_vta: null,
 Cbte_nro: null,
 Tipo_expo: null,
 Permiso_existente: null,
 Permisos: [],
 Dst_cmp: null,
 Cliente: null,
 Cuit_pais_cliente: null,
 Domicilio_cliente: null,
 Id_impositivo: null,
 Moneda_Id: null,
 Moneda_ctz: null,
 Obs_comerciales: null,
 Imp_total: null,
 Obs: null,
 Cmps_asoc: [],
 Forma_pago: null,
 Incoterms: null,
 Incoterms_Ds: null,
 Idioma_cbte: null,
 <Items>
 <Item>
 <Pro_codigo>string</Pro_codigo>
 <Pro_ds>string</Pro_ds>
 <Pro_qty>decimal</Pro_qty>
 <Pro_umed>int</Pro_umed>
 <Pro_precio_uni>decimal</Pro_precio_uni>
 <Pro_bonificacion>decimal</Pro_bonificacion>
 <Pro_total_item>decimal</Pro_total_item>
 </Item>
 <Item>
 <Pro_codigo>string</Pro_codigo>
 <Pro_ds>string</Pro_ds>
 <Pro_qty>decimal</Pro_qty>
 <Pro_umed>int</Pro_umed>
 <Pro_precio_uni>decimal</Pro_precio_uni>
 <Pro_bonificacion>decimal</Pro_bonificacion>
 <Pro_total_item>decimal</Pro_total_item>
 </Item>
 </Items>
 <Opcionales>
};


const afip = new Afip({ CUIT: 20111111112 });

afip.ElectronicBilling.createVoucher(data).then(res => {
	console.log(res)
});

 */