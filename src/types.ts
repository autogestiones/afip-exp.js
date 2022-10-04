interface IPermission{
    Id_permisos?: string
    Dst_merc?: string
}

interface IVoucherAssoc{
    Cbte_tipo?: number
    Cbte_punto_vta?:number
    Cbte_nro?:number
    Cbte_cuit?:number
}
interface IItems{
    Pro_codigo?: string
    Pro_ds: string
    Pro_qty?: number
    Pro_umed: number
    Pro_precio_uni?: number
    Pro_bonificacion?: number
    Pro_total_item: number  
}
interface IOpcionales{
    Id: string
    Valor: string
}
/**
 * <Item>
    <Pro_codigo>string</Pro_codigo>
    <Pro_ds>string</Pro_ds>
    <Pro_qty>decimal</Pro_qty>
    <Pro_umed>int</Pro_umed>
    <Pro_precio_uni>decimal</Pro_precio_uni>
    <Pro_bonificacion>decimal</Pro_bonificacion>
    <Pro_total_item>decimal</Pro_total_item>
    </Item>
 */
export interface ICreateVoucherExport {
    Fecha_cbte?: string
    Cbte_Tipo: string
    Punto_vta: number
    Cbte_nro?: number
    Tipo_expo: number
    Permiso_existente?: "S"| "N" 
    Permisos?: IPermission[]
    Dst_cmp: number
    Cliente: string
    Cuit_pais_cliente?: number
    Domicilio_cliente: string
    Id_impositivo?: string
    Moneda_Id: string
    Moneda_ctz: number
    Obs_comerciales?: number
    Imp_total: number
    Obs: string
    Cmps_asoc?: IVoucherAssoc[]
    Forma_pago?: string
    Incoterms?: string
    Incoterms_Ds?: string
    Idioma_cbte: string
    Items: IItems
    Opcionales?: IOpcionales
    Fecha_pago?: string
   };
   