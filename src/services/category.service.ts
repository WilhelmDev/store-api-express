import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class CategoryService {
  async getAll() {
    const categories = await prisma.category.findMany()
    return categories
  }
  async getById(id: number) {
    const category = await prisma.category.findUnique({ where: { id } })
    return category
  }
  async getByName(name: string) {
    const category = await prisma.category.findUnique({ where: { name } })
    return category
  }
  async create(name: string, color: string) {
    const category = await prisma.category.create({
      data: {
        name,
        color
      }
    })
    return category
  }
  async update(id: number, name: string, color: string) {
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        color
      }
    })
    return updatedCategory
  }
  async delete(id: number) {
    const deletedCategory = await prisma.category.delete({ where: { id } })
    return deletedCategory
  }
}

export default new CategoryService()