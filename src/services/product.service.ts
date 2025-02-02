import { PrismaClient } from '@prisma/client'
import { imageService } from './image.service'

const prisma = new PrismaClient()

class ProductService {
  async getAll() {
    const products = await prisma.product.findMany()
    return products
  }

  async getById(id: number,) {
    const product = await prisma.product.findUnique({ where: { id }, include: { images: true, category:true } })
    if (product && product.images) {
      product.images = product.images.map((image) => ({...image, url: imageService.getProductImageUrl(image.url)}))
    }
    return product
  }


  async getByStore(storeId: number) {
    const products = await prisma.product.findMany({
      where: { storeId },
      include: { images: true, category:true }
    })
    return products.map((product) => ({...product, images: product.images.map((image) => ({ ...image, url: imageService.getProductImageUrl(image.url)})) }));
  }

  async getByCategory(categoryId: number) {
    const products = await prisma.product.findMany({
      where: { categoryId },
    })
    return products;
  }

  async create(name: string, price: number, storeId: number, categoryId: number) {
    const product = await prisma.product.create({
      data: {
        name,
        price,
        store: {
          connect: { id: storeId }
        },
        category: {
          connect: { id: categoryId }
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

  async addImage(productId: number, imageUrl: string) {
    return await prisma.productImage.create({
      data: {
        url: imageUrl,
        productId: productId,
      },
    });
  }
}

export default new ProductService()