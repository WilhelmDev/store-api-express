# Store API

## Flujo de Creación de Factura

El proceso de creación de una factura implica varios pasos y afecta a múltiples modelos en nuestra base de datos. A continuación, se detalla el flujo recomendado:

1. **Iniciar la Transacción de Base de Datos**
   - Comenzar una transacción de base de datos para garantizar la integridad de los datos en caso de fallos.

2. **Crear la Factura (Invoice)**
   - Crear un nuevo registro en la tabla `Invoice` con la siguiente información:
     - `invoiceNumber`: Generar un número único para la factura.
     - `userId`: ID del usuario que crea la factura.
     - `storeId`: ID de la tienda donde se realiza la venta.
     - `totalAmount`: Inicialmente 0, se actualizará más tarde.
     - `status`: Inicialmente 'PENDING'.

3. **Procesar los Items de la Factura**
   - Para cada producto en la venta:
     a. Crear un `InvoiceItem`:
        - `invoiceId`: ID de la factura creada.
        - `productId`: ID del producto.
        - `quantity`: Cantidad vendida.
        - `unitPrice`: Precio unitario del producto.
        - `subtotal`: Calcular (quantity * unitPrice).
     
     b. Actualizar el inventario:
        - Crear un `InventoryTransaction`:
          - `productId`: ID del producto.
          - `quantity`: Cantidad vendida (como número negativo).
          - `type`: 'SALE'.
          - `invoiceItemId`: ID del InvoiceItem creado.

     c. Actualizar el `totalAmount` de la factura sumando el `subtotal` del item.

4. **Finalizar la Factura**
   - Actualizar el `Invoice`:
     - Establecer el `totalAmount` final.
     - Cambiar el `status` a 'PAID' si el pago se realiza inmediatamente.

5. **Commit de la Transacción**
   - Si todos los pasos anteriores son exitosos, hacer commit de la transacción.

6. **Manejo de Errores**
   - En caso de error en cualquier paso, hacer rollback de la transacción y manejar la excepción adecuadamente.

### Consideraciones Adicionales

- **Validaciones**: Antes de crear la factura, asegurarse de que:
  - El usuario tiene permisos para crear facturas.
  - La tienda existe y está activa.
  - Hay suficiente inventario para cada producto.

- **Concurrencia**: Implementar bloqueos adecuados para manejar múltiples transacciones simultáneas.

- **Logs**: Mantener logs detallados de cada paso del proceso para facilitar la depuración y auditoría.

- **Notificaciones**: Considerar enviar notificaciones al usuario y/o administrador tras la creación exitosa de la factura.

### Ejemplo de Código (Pseudocódigo)

```typescript
async function createInvoice(userId: number, storeId: number, items: InvoiceItem[]) {
  const prisma = new PrismaClient()
  
  try {
    await prisma.$transaction(async (prisma) => {
      // Crear la factura
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber: generateUniqueInvoiceNumber(),
          userId,
          storeId,
          totalAmount: 0,
          status: 'PENDING'
        }
      })

      let totalAmount = 0

      // Procesar cada item
      for (const item of items) {
        const invoiceItem = await prisma.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.quantity * item.unitPrice
          }
        })

        await prisma.inventoryTransaction.create({
          data: {
            productId: item.productId,
            quantity: -item.quantity,
            type: 'SALE',
            invoiceItemId: invoiceItem.id
          }
        })

        totalAmount += invoiceItem.subtotal
      }

      // Actualizar el total de la factura
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { totalAmount, status: 'PAID' }
      })
    })

    console.log('Factura creada exitosamente')
  } catch (error) {
    console.error('Error al crear la factura:', error)
    throw error
  }
}