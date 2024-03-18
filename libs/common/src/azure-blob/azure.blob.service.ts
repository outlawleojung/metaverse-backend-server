import { Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
@Injectable()
export class AzureBlobService {
  readonly azureConnection = process.env.AZURE_CONNECTION_STRING;
  readonly containerName = process.env.AZURE_CONTAINER;

  // Upload file
  getBlobClient(imageName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(
      this.azureConnection,
    );
    const containerClient = blobClientService.getContainerClient(
      this.containerName,
    );
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async upload(file: Express.Multer.File, path: string) {
    console.log(path);
    const decodedPath = decodeURIComponent(path);
    const blobClient = this.getBlobClient(decodedPath);
    const result = await blobClient.uploadData(file.buffer);

    console.log('Image Upload Result : ', result);
  }

  //   read file from azureblob
  async getfile(fileName: string, containerName: string) {
    const decodedFile = decodeURIComponent(fileName);
    const blobClient = this.getBlobClient(decodedFile);
    const blobDownloaded = await blobClient.download();
    return blobDownloaded.readableStreamBody;
  }
  //   delete file
  async deletefile(filename: string) {
    console.log('filename : ', filename);
    const decodedFile = decodeURIComponent(filename);
    const blobClient = this.getBlobClient(decodedFile);
    const result = await blobClient.deleteIfExists();
    console.log('Image Delete Result : ', result);
  }

  async deleteFolder(folderName: string) {
    const decodedFolder = decodeURIComponent(folderName);
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      this.azureConnection,
    );
    const containerClient = blobServiceClient.getContainerClient(
      this.containerName,
    );

    const blobs = containerClient.listBlobsFlat({ prefix: decodedFolder });
    for await (const blob of blobs) {
      const blockBlobClient = containerClient.getBlockBlobClient(blob.name);
      await blockBlobClient.deleteIfExists();
      console.log(`Blob ${blob.name} deleted`);
    }
  }
}
