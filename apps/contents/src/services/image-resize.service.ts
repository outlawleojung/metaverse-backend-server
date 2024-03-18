import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class ImageResizeService {
  async resizeImage(
    buffer: Buffer,
    maxWidth: number,
    maxHeight: number,
  ): Promise<Buffer> {
    return await sharp(buffer)
      .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();
  }

  async resizeImageIfNeeded(
    buffer: Buffer,
    maxWidth: number,
    maxHeight: number,
    maxSizeLimitBytes: number,
  ): Promise<Buffer> {
    // 가로 세로 사이즈를 초과하는 경우 리사이즈
    const resizedImage = await sharp(buffer)
      .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();

    // 용량이 초과하는 경우 품질을 조절하여 용량을 줄임
    let optimizedImage = resizedImage;
    if (resizedImage.byteLength > maxSizeLimitBytes) {
      let quality = 100;
      do {
        quality -= 5;
        optimizedImage = await sharp(resizedImage)
          .resize(maxWidth, maxHeight, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: quality })
          .toBuffer();
      } while (optimizedImage.byteLength > maxSizeLimitBytes && quality > 5);

      if (optimizedImage.byteLength > maxSizeLimitBytes) {
        throw new Error('Cannot resize the image within the size limit.');
      }
    }

    return optimizedImage;
  }
}
