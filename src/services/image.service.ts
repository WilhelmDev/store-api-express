import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import { ImageFolder } from '../types/enums';


class ImageService {
  private minioClient: Minio.Client;
  private bucketName: string;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
    this.bucketName = process.env.MINIO_BUCKET_NAME || 'store-images';
  }

  private base64ToBuffer(base64String: string): Buffer {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }

  private async uploadImage(folder: ImageFolder, base64Image: string, fileExtension: string): Promise<string> {
    const buffer = this.base64ToBuffer(base64Image);
    const objectName = `${folder}/${uuidv4()}.${fileExtension}`;

    await this.minioClient.putObject(this.bucketName, objectName, buffer, buffer.length);

    return objectName;
  }

  async deleteImage(objectName: string): Promise<void> {
    await this.minioClient.removeObject(this.bucketName, objectName);
  }

  private getImageUrl(objectName: string): string {
    const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
    const endpoint = process.env.MINIO_ENDPOINT || 'localhost';
    const port = process.env.MINIO_PORT || '9000';

    // Si el puerto es 80 (HTTP) o 443 (HTTPS), no lo incluimos en la URL
    const portString = (port === '80' || port === '443') ? '' : `:${port}`;

    return `${protocol}://${endpoint}${portString}/${this.bucketName}/${objectName}`;
  }


  async initializeBucket(): Promise<void> {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      await this.minioClient.makeBucket(this.bucketName);
    }
  }

  // Métodos específicos para cada tipo de imagen
  async uploadUserImage(base64Image: string, fileExtension: string): Promise<string> {
    return this.uploadImage(ImageFolder.USERS, base64Image, fileExtension);
  }

  async uploadProductImage(base64Image: string, fileExtension: string): Promise<string> {
    return this.uploadImage(ImageFolder.PRODUCTS, base64Image, fileExtension);
  }

  async deleteUserImage(objectName: string): Promise<void> {
    return this.deleteImage(objectName);
  }

  async deleteProductImage(objectName: string): Promise<void> {
    return this.deleteImage(objectName);
  }

  getUserImageUrl(objectName: string): string {
    return this.getImageUrl(objectName);
  }

  getProductImageUrl(objectName: string): string {
    return this.getImageUrl(objectName);
  }
}

export const imageService = new ImageService();

