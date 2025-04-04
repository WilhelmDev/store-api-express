import { PrismaClient } from '@prisma/client'
import { imageService } from './image.service'
const prisma = new PrismaClient()

class CartService {
  async getCart(userId: number) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: true,
                category: true
              }
            }
          }
        }
      },
      omit: {
        createdAt: true,
        updatedAt: true,
        userId: true
      }
    })
    if (cart) {
      const updatedProducts = cart?.items.map((item) => ({...item, product: {...item.product, images: item.product.images.map((image) => ({...image, url: imageService.getProductImageUrl(image.url)})) } }))
      cart.items = updatedProducts
    }
    return cart
  }

  async addToCart(userId: number, productId: number, quantity: number) {
    let cart = await prisma.cart.findUnique({ where: { userId } })

    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } })
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    })

    if (existingItem) {
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
    } else {
      return await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      })
    }
  }

  async removeFromCart(userId: number, productId: number) {
    const cart = await prisma.cart.findUnique({ where: { userId } })

    if (!cart) {
      throw new Error('Cart not found')
    }

    return await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    })
  }

  async updateCartItemQuantity(userId: number, productId: number, quantity: number) {
    const cart = await prisma.cart.findUnique({ where: { userId } })

    if (!cart) {
      throw new Error('Cart not found')
    }

    return await prisma.cartItem.update({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      },
      data: { quantity }
    })
  }

  async clearCart(userId: number) {
    const cart = await prisma.cart.findUnique({ where: { userId } })

    if (!cart) {
      throw new Error('Cart not found')
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    })

    return { message: 'Cart cleared successfully' }
  }
}

export default new CartService()