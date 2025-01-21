import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

class StoreService {
  async getAll() {
    const stores = await prisma.store.findMany()
    return stores
  }

  async getById(id: number, includeUsers?: boolean) {
    const store = await prisma.store.findUnique({ where: { id }, include: { employees: Boolean(includeUsers) }})
    // if (!store) {
    //   throw new Error('Store not found')
    // } //! restore in prod
    return store
  }

  async create(name: string) {
    const store = await prisma.store.create({ data: { name } })
    return store
  }

  async update(id: number, name: string) {
    const updatedStore = await prisma.store.update({
      where: { id },
      data: { name },
    })
    if (!updatedStore) {
      throw new Error('Store not found')
    }
    return updatedStore
  }
}

export default new StoreService()