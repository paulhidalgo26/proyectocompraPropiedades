
export interface Propiedad{
    direccion: string;
    ciudad: string;
    ubicacion: {
        lat: number;
        lng: number;
    };
    precio: number;
    telefono: number;
    descripcion: string;
    foto: string;
    id: string;
    idc: string;
    fecha: Date;
}
export interface Cliente{
    uid: string;
    email: string;
    nombre: string;
    celular: string;
    foto: string;
    referencia: string;
    ubicacion: any;
}

export interface Compra{
    id: string;
    cliente: Cliente;
    productos: ProductoPedido[];
    estado: string;
    fecha: any;
}
export interface ProductoPedido{
    producto: Propiedad;
}
export type EstadoPedido='visto'|'comprado';
