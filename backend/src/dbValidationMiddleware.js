const {
  findPagaIVAProductos,
  tieneComprobante,
  ventaExiste
} = require('./dbAdmin.js');

const handleUnexpectedError = res => err =>
  res
    .status(500)
    .send('No se pudo validar la venta en la base de datos ' + err);

const validarIVAEnUnidades = (req, res, next) => {
  const venta = req.safeData;
  const productoKeys = venta.unidades.map(u => u.producto);
  findPagaIVAProductos(productoKeys).then(rows => {
    if (venta.tipo === 1 && rows.some(({ pagaIva }) => pagaIva))
      return res
        .status(400)
        .send(
          'Las facturas de examenes no pueden contener productos que pagan IVA'
        );

    if (venta.tipo === 0 && rows.some(({ pagaIva }) => !pagaIva))
      return res
        .status(400)
        .send(
          'Las facturas de productos no pueden contener elementos que NO pagan IVA'
        );

    next();
  });
};

const validarVentaMutable = key => (req, res, next) => {
  const venta = req[key] || {};

  ventaExiste(venta.rowid)
    .then(async ventaEncontrada => {
      if (!ventaEncontrada) return res.status(404).send('Venta no encontrada');

      if (await tieneComprobante(venta.rowid))
        return res
          .status(400)
          .send(
            'Esta venta no se puede modificar porque ya emitió un comprobante electrónico'
          );

      next();
    })
    .catch(handleUnexpectedError(res));
};

module.exports = { validarVentaMutable, validarIVAEnUnidades };
