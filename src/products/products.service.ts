import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma:PrismaService){};

  // to create a product
  async create(createProductDto: CreateProductDto){
    try {
      const product = await this.prisma.products.create({
      data:createProductDto
    });
    return product;
  } catch(error){
   throw new InternalServerErrorException('Failed to create product');
  }
  }

  // read all products
  async findAll() {
    try{
      const products = await this.prisma.products.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    if(!products){
      return {
        error: "Not Found",
        statusCode: 404
      }
    }
    return products;
  } catch(error){
   throw new InternalServerErrorException('Failed to fetch products');
  }
  }

  // read one product by id
  async findOne(id: number) {
    try {
      const product = await this.prisma.products.findFirst({
      where:{id}
    });
    if(!product){
      return {
        error: "Not Found",
        statusCode: 404
      }
    }
    return product;
  } catch(error){
     throw new NotFoundException(`Product with id ${id} not found`);
  }
  }

  // update a product 
  async update(id: number, updateProductDto: UpdateProductDto) {
    try{
      await this.findOne(id);
    return this.prisma.products.update({
      where:{id},
      data: updateProductDto
    });
  }catch(error){
    if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update product');
  } 
  }

  // delete a product
  async remove(id: number) {
    try{
      await this.findOne(id);
     this.prisma.products.delete({
      where:{id}
    });
    return {
      message: 'Product delete successfully'
    }
  }catch(error){
    if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete product');
  }
  }
}