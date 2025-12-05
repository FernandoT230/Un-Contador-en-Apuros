
import { AccountTerm, ShopItem } from './types';

export const ALPHABET = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

// --- Shop Catalog ---
export const SHOP_ITEMS: ShopItem[] = [
  // --- Suits ---
  {
    id: 'suit_classic_navy',
    type: 'suit',
    name: 'Clásico Azul',
    price: 0,
    currency: 'coins',
    primaryColor: '#172554',
    secondaryColor: '#1e3a8a'
  },
  {
    id: 'suit_charcoal',
    type: 'suit',
    name: 'Gris Ejecutivo',
    price: 100,
    currency: 'coins',
    primaryColor: '#374151',
    secondaryColor: '#4b5563'
  },
  {
    id: 'suit_brown',
    type: 'suit',
    name: 'Café Vintage',
    price: 150,
    currency: 'coins',
    primaryColor: '#451a03',
    secondaryColor: '#78350f'
  },
  {
    id: 'suit_black',
    type: 'suit',
    name: 'Negro Elegante',
    price: 300,
    currency: 'coins',
    primaryColor: '#000000',
    secondaryColor: '#1f2937'
  },
  {
    id: 'suit_burgundy',
    type: 'suit',
    name: 'Vino Tinto',
    price: 2,
    currency: 'diamonds',
    primaryColor: '#450a0a',
    secondaryColor: '#7f1d1d'
  },
  {
    id: 'suit_white',
    type: 'suit',
    name: 'Blanco Maestro',
    price: 5,
    currency: 'diamonds',
    primaryColor: '#cbd5e1',
    secondaryColor: '#f1f5f9'
  },

  // --- Ties ---
  {
    id: 'tie_gold',
    type: 'tie',
    name: 'Corbata Dorada',
    price: 0,
    currency: 'coins',
    primaryColor: '#ca8a04',
    secondaryColor: '#facc15'
  },
  {
    id: 'tie_red',
    type: 'tie',
    name: 'Rojo Poder',
    price: 50,
    currency: 'coins',
    primaryColor: '#991b1b',
    secondaryColor: '#ef4444'
  },
  {
    id: 'tie_blue',
    type: 'tie',
    name: 'Azul Real',
    price: 50,
    currency: 'coins',
    primaryColor: '#1e3a8a',
    secondaryColor: '#3b82f6'
  },
  {
    id: 'tie_green',
    type: 'tie',
    name: 'Verde Dólar',
    price: 75,
    currency: 'coins',
    primaryColor: '#14532d',
    secondaryColor: '#22c55e'
  },
  {
    id: 'tie_purple',
    type: 'tie',
    name: 'Violeta Innovador',
    price: 1,
    currency: 'diamonds',
    primaryColor: '#581c87',
    secondaryColor: '#a855f7'
  },

  // --- Office Decor (Wall/Environment) ---
  {
    id: 'decor_none',
    type: 'decor',
    name: 'Oficina Simple',
    price: 0,
    currency: 'coins',
    primaryColor: 'transparent',
    secondaryColor: 'transparent'
  },
  {
    id: 'decor_diploma',
    type: 'decor',
    name: 'Título Universitario',
    price: 150,
    currency: 'coins',
    primaryColor: '#fef3c7',
    secondaryColor: '#92400e'
  },
  {
    id: 'decor_plant',
    type: 'decor',
    name: 'Planta de Oficina',
    price: 200,
    currency: 'coins',
    primaryColor: '#166534',
    secondaryColor: '#b91c1c' // Pot color
  },
  {
    id: 'decor_clock',
    type: 'decor',
    name: 'Reloj Moderno',
    price: 300,
    currency: 'coins',
    primaryColor: '#1f2937',
    secondaryColor: '#e5e7eb'
  },
  {
    id: 'decor_window',
    type: 'decor',
    name: 'Vista a la Ciudad',
    price: 3,
    currency: 'diamonds',
    primaryColor: '#60a5fa',
    secondaryColor: '#3b82f6'
  },

  // --- Desk Accessories ---
  {
    id: 'acc_none',
    type: 'accessory',
    name: 'Escritorio Limpio',
    price: 0,
    currency: 'coins',
    primaryColor: 'transparent',
    secondaryColor: 'transparent'
  },
  {
    id: 'acc_coffee',
    type: 'accessory',
    name: 'Café Cargado',
    price: 50,
    currency: 'coins',
    primaryColor: '#ef4444', // Red Mug
    secondaryColor: '#3f1606' // Coffee
  },
  {
    id: 'acc_pens',
    type: 'accessory',
    name: 'Set de Bolígrafos',
    price: 80,
    currency: 'coins',
    primaryColor: '#2563eb', 
    secondaryColor: '#1e40af'
  },
  {
    id: 'acc_calc',
    type: 'accessory',
    name: 'Calculadora',
    price: 100,
    currency: 'coins',
    primaryColor: '#475569',
    secondaryColor: '#94a3b8'
  },
  {
    id: 'acc_folders',
    type: 'accessory',
    name: 'Carpetas',
    price: 120,
    currency: 'coins',
    primaryColor: '#f59e0b',
    secondaryColor: '#d97706'
  },
  {
    id: 'acc_lamp',
    type: 'accessory',
    name: 'Lámpara Dorada',
    price: 250,
    currency: 'coins',
    primaryColor: '#eab308',
    secondaryColor: '#fde047'
  },
  {
    id: 'acc_laptop',
    type: 'accessory',
    name: 'Laptop Gamer',
    price: 5,
    currency: 'diamonds',
    primaryColor: '#a855f7',
    secondaryColor: '#1e1b4b'
  }
];

export const GAME_TERMS: AccountTerm[] = [
  // --- ACTIVO ---
  {
    name: "CAJA",
    classification: "Activo",
    definition: "Dinero en efectivo."
  },
  {
    name: "BANCOS",
    classification: "Activo",
    definition: "Dinero en cuentas bancarias."
  },
  {
    name: "MERCANCIAS",
    classification: "Activo",
    definition: "Artículos disponibles para la venta."
  },
  {
    name: "CLIENTES",
    classification: "Activo",
    definition: "Personas que deben por mercancía a crédito."
  },
  {
    name: "DEUDORES DIVERSOS",
    classification: "Activo",
    definition: "Personas que deben a la empresa por conceptos distintos a mercancías."
  },
  {
    name: "IVA ACREDITABLE",
    classification: "Activo",
    definition: "Impuesto pagado en compras."
  },
  {
    name: "ALMACEN",
    classification: "Activo",
    definition: "Lugar donde se guardan las mercancías."
  },
  {
    name: "PAPELERIA Y UTILES",
    classification: "Activo",
    definition: "Materiales de oficina para uso de la empresa."
  },
  {
    name: "PROPAGANDA",
    classification: "Activo",
    definition: "Estrategias para dar a conocer el producto o servicio."
  },
  {
    name: "PRIMAS DE SEGUROS",
    classification: "Activo",
    definition: "Pagos realizados a aseguradoras para proteger bienes."
  },
  {
    name: "RENTAS PAGADAS POR ANTICIPADO",
    classification: "Activo",
    definition: "Importe de rentas pagadas antes de su vencimiento."
  },
  {
    name: "ANTICIPO A PROVEEDORES",
    classification: "Activo",
    definition: "Pagos parciales o totales a cuenta de futuras compras."
  },
  {
    name: "TERRENOS",
    classification: "Activo",
    definition: "Predios propiedad de la empresa."
  },
  {
    name: "EDIFICIOS",
    classification: "Activo",
    definition: "Construcciones propiedad de la empresa."
  },
  {
    name: "MOBILIARIO Y EQUIPO",
    classification: "Activo",
    definition: "Muebles de oficina."
  },
  {
    name: "EQUIPO DE COMPUTO",
    classification: "Activo",
    definition: "Computadoras y periféricos."
  },
  {
    name: "EQUIPO DE TRANSPORTE",
    classification: "Activo",
    definition: "Vehículos de la empresa."
  },
  {
    name: "PATENTES",
    classification: "Activo",
    definition: "Derechos exclusivos de explotación."
  },

  // --- PASIVO ---
  {
    name: "PROVEEDORES",
    classification: "Pasivo",
    definition: "Deudas por compra de mercancía."
  },
  {
    name: "DOCUMENTOS POR PAGAR",
    classification: "Pasivo",
    definition: "Pagarés o letras de cambio."
  },
  {
    name: "ACREEDORES DIVERSOS",
    classification: "Pasivo",
    definition: "Personas o entidades a quienes se debe por conceptos distintos a la compra de mercancías."
  },
  {
    name: "ANTICIPO DE CLIENTES",
    classification: "Pasivo",
    definition: "Cobros anticipados a cuenta de futuras ventas."
  },
  {
    name: "IVA TRASLADADO",
    classification: "Pasivo",
    definition: "El impuesto que la empresa cobra a sus clientes al realizar ventas y que debe entregar al SAT."
  },
  {
    name: "IMPUESTOS POR PAGAR",
    classification: "Pasivo",
    definition: "Obligaciones fiscales generadas (ISR, PTU) que están pendientes de pago."
  },
  {
    name: "RENTAS COBRADAS POR ANTICIPADO",
    classification: "Pasivo",
    definition: "Importe de rentas cobradas antes de que transcurra el tiempo."
  },
  {
    name: "INTERESES COBRADOS POR ANTICIPADO",
    classification: "Pasivo",
    definition: "Intereses cobrados antes del vencimiento del crédito."
  },
  {
    name: "HIPOTECAS POR PAGAR",
    classification: "Pasivo",
    definition: "Deudas contraídas por la empresa que tienen como garantía bienes inmuebles."
  },

  // --- PATRIMONIO ---
  {
    name: "CAPITAL SOCIAL",
    classification: "Patrimonio",
    definition: "Aportaciones de los socios."
  },
  {
    name: "UTILIDAD DEL EJERCICIO",
    classification: "Patrimonio",
    definition: "Ganancia neta obtenida."
  },
  {
    name: "RESERVA LEGAL",
    classification: "Patrimonio",
    definition: "Separación de utilidades por ley."
  },

  // --- INGRESOS ---
  {
    name: "VENTAS",
    classification: "Ingresos",
    definition: "Ingresos por actividad principal."
  },
  {
    name: "PRODUCTOS FINANCIEROS",
    classification: "Ingresos",
    definition: "Ganancias por intereses o inversiones."
  },
  {
    name: "OTROS PRODUCTOS",
    classification: "Ingresos",
    definition: "Ingresos no relacionados con el giro principal."
  },
  
  // --- EGRESOS ---
  {
    name: "COSTO DE VENTAS",
    classification: "Egresos",
    definition: "Valor de adquisición de lo vendido."
  },
  {
    name: "GASTOS DE VENTA",
    classification: "Egresos",
    definition: "Gastos para distribución y venta."
  },
  {
    name: "GASTOS DE ADMINISTRACION",
    classification: "Egresos",
    definition: "Gastos de dirección y control."
  },
  {
    name: "GASTOS FINANCIEROS",
    classification: "Egresos",
    definition: "Pérdidas por intereses bancarios."
  },
  {
    name: "OTROS GASTOS",
    classification: "Egresos",
    definition: "Gastos eventuales no operativos."
  }
];
