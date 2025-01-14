import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class ProductService {
  async getAll() {
    const products = await prisma.product.findMany()
    return products
  }

  async getById(id: number) {
    const product = await prisma.product.findUnique({ where: { id } })
    return product
  }

  async getByStore(storeId: number) {
    const products = await prisma.product.findMany({
      where: { storeId },
    })
    return products;
  }

  async create(name: string, price: number, storeId: number) {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        store: {
          connect: { id: storeId }
        }
      }
    })
    return product;
  }

  async update(id: number, name: string, price: number) {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { name, price },
    })
    return updatedProduct;
  }
}

export default new ProductService()