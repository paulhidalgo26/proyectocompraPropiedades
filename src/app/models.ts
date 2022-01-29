
export interface Producto{
    nombre: string;
    precioNormal: number;
    precioReducido: number;
    foto: string;
    id: string;
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

export interface Pedido{
    id: string;
    cliente: Cliente;
    productos: ProductoPedido[];
    precioTotal: string;
    estado: string;
    fecha: string;
    valoracion: number;
}
export interface ProductoPedido{
    producto: Producto;
    catidad: number;
}
export type EstadoPedido='enviado'|'visto'|'camino'|'entregado';
