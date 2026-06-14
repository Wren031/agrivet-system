import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('upload')
export class UploadController {
  @Post('public/id-verification')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'id-verification');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const sanitized = file.originalname.replace(
            /[^a-zA-Z0-9._-]/g,
            '_',
          );
          const ext = extname(sanitized);
          const name = sanitized.slice(0, -ext.length) || 'file';
          cb(null, `${Date.now()}-${name}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|webp|gif)$/i;
        if (allowed.test(extname(file.originalname))) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only image files (jpg, jpeg, png, webp, gif) are allowed',
            ),
            false,
          );
        }
      },
    }),
  )
  uploadIdVerification(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const protocol = req.protocol;
    const host = req.get('host');
    const url = `${protocol}://${host}/uploads/id-verification/${file.filename}`;
    return { url };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadPath = join(process.cwd(), 'uploads', 'inventory');
          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }
          cb(null, uploadPath);
        },
        filename: (_req, file, cb) => {
          const sanitized = file.originalname.replace(
            /[^a-zA-Z0-9._-]/g,
            '_',
          );
          const ext = extname(sanitized);
          const name = sanitized.slice(0, -ext.length) || 'file';
          cb(null, `${Date.now()}-${name}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|webp|gif)$/i;
        if (allowed.test(extname(file.originalname))) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Only image files (jpg, jpeg, png, webp, gif) are allowed',
            ),
            false,
          );
        }
      },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    const protocol = req.protocol;
    const host = req.get('host');
    const url = `${protocol}://${host}/uploads/inventory/${file.filename}`;
    return { url };
  }
}
