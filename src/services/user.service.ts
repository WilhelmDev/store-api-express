import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.config'

const prisma = new PrismaClient()

class UserService  {
  getAll = async () => {
    const users = await prisma.user.findMany()
    return users
  }

  getById = async (id: number) => {
    const user = await prisma.user.findUnique({ where: { id } })
    return user
  }

  getByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  }

  create = async (password: string, email: string, name:string, lastName:string, rolId: number) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = await prisma.role.findUnique({ where: { id: rolId } });

    if (!role) throw new Error('Role not found');

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        lastName,
        password: hashedPassword,
        role: {
          connect: { id: rolId }
        }
      }
    });
    return newUser;
  }

  login = async (email: string, password: string) => {
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { token: null };
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { token };
  }

  verifyToken = (token: string) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded as JwtPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export default new UserService()
