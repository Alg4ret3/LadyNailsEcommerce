export const FAQ_CONTENT = {
  header: {
    surtitle: "Centro de Soporte",
    title: "PREGUNTAS FRECUENTES"
  },
  faqs: [
    { q: '¿Cómo puedo comprar en Ladynail Shop?', a: 'El registro en nuestro sitio es abierto para todo el público. Sin embargo, dado que manejamos precios mayoristas, la condición para procesar cualquier pedido es que el valor total de la compra sea igual o superior a $200.000 COP.' },
    { q: '¿Los precios incluyen IVA?', a: 'Nuestros precios son de distribución mayorista. La factura generada cumplirá con toda la normativa legal vigente.' },
    { q: '¿Realizan envíos a todo el país?', a: 'Sí, contamos con una red logística propia y aliados estratégicos que nos permiten llegar a todos los municipios de Colombia con tiempos de entrega de 24 a 72 horas hábiles.' },
    { q: '¿Qué garantía tienen los equipos de mobiliario?', a: 'Todos nuestros equipos de mobiliario profesional cuentan con una garantía estructural de 12 meses y 6 meses en componentes electrónicos bajo uso normal en salón.' },
    { q: '¿Tienen punto de venta físico?', a: 'Nuestra operación central es en el Parque Industrial Sur en Pasto, donde contamos con un showroom técnico para demostración de productos y equipos.' },
    { q: '¿Cómo se maneja el costo del envío?', a: 'No manejamos envíos contraentrega. Para envíos nacionales, el cliente paga el flete directamente a la transportadora. Para pedidos en Pasto y corregimientos aledaños (Catambuco, Gualmatán, Jongovito), se cobra un valor fijo de $7.000 COP incluido en la factura.' },
  ]
};

export const SHIPPING_CONTENT = {
  header: {
    surtitle: "Guía de Distribución",
    title: "Política de Envíos",
    subtitle: "Cobertura Nacional y Logística"
  },
  sections: [
    {
      title: "TIEMPOS DE DESPACHO",
      content: "Toda orden confirmada antes de las 14:00 horas será procesada y entregada a la empresa transportadora el mismo día hábil. Órdenes posteriores se despachan en las siguientes 24 horas."
    },
    {
      title: "POLÍTICA DE PAGOS Y ENVÍOS",
      content: "No manejamos la modalidad de envíos contraentrega. El valor del envío debe ser cancelado directamente por el cliente a la empresa transportadora al momento de recibir su pedido, por lo cual la factura solo reflejará el costo de los productos.",
      exceptionTitle: "EXCEPCIÓN LOCAL PASTO:",
      exceptionText: " Para pedidos realizados dentro del casco urbano de Pasto y los corregimientos de Catambuco, Gualmatán y Jongovito, se cobrará una tarifa única de ",
      exceptionPrice: "$7.000",
      exceptionEnd: " la cual será incluida automáticamente en la misma factura."
    },
    {
      title: "TRAZABILIDAD",
      content: "Una vez la mercancía sale de nuestro Hub Logístico, el cliente recibirá un código de seguimiento para monitorear el progreso de su entrega en tiempo real a través del portal de la transportadora asignada."
    }
  ]
};

export const RETURNS_CONTENT = {
  header: {
    surtitle: "Protocolo de Post-Venta",
    title: "Política de Devoluciones",
    subtitle: "Vigente para el mercado nacional"
  },
  sections: [
    {
      title: "PLAZOS DE RECLAMACIÓN",
      content: "El cliente profesional dispone de un plazo de 5 días hábiles desde la recepción del despacho para notificar cualquier discrepancia en el inventario o daños visibles en el empaque industrial."
    },
    {
      title: "CONDICIONES DEL PRODUCTO",
      content: "Para ser elegible para devolución, el producto debe conservar sus sellos originales, empaque de fábrica sin alteraciones y no haber sido utilizado. Los consumibles (esmaltes, polvos, químicos) no tienen devolución una vez abierto el sello de seguridad."
    },
    {
      title: "PROCESO LOGÍSTICO",
      content: "LADYNAIL SHOP asumirá los costos de transporte únicamente en casos comprobados de error en el despacho o fallas de fabricación. En otros casos, el transporte corre por cuenta del usuario."
    }
  ]
};
