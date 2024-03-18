import { ERRORCODE, ERROR_MESSAGE } from '@libs/constants';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PostIAPGoogleReceiptValidationDto } from './dto/request/iap.google.receipt.validation.dto';
import iap from 'iap';

@Injectable()
export class IapService {
  private readonly logger = new Logger(IapService.name);
  // 구글 영수증 검증
  async postIAPGoogleReceiptValidation(
    data: PostIAPGoogleReceiptValidationDto,
  ) {
    const purchaseToken = data.purchaseToken;
    const productId = data.productId;
    const packageName = data.packageName;

    // DB에 영수증 정보 존재하는지 먼저 체크

    let platform = 'google';
    // console.log(path.join(__dirname, './arzmeta-361813-41dd66d11ab6.json'));
    let payment = {
      receipt: purchaseToken, // always required (purchaseToken)
      productId: productId,
      packageName: packageName,
      keyObject: {
        type: 'service_account',
        project_id: 'arzmeta-361813',
        private_key_id: '7edc933c146dfb4f9f2d318073c9c72b26f21d01',
        private_key:
          '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyWEILma9RwJUV\nGX2Dwti0MjK8HAEwRrUAtcwZtGJq43BNIzg3x2inIRAhvr94RRZETdl4F43kvSkL\n1lFAuifRThYT1AC9kKm+hBYpR3qrw8JsnlwVe34aSpKUFc1A3cclT1q49IDtcBaF\ndnKTQHUrV3vNuIYpmFyoUgf1RWGW4m3EJRHwYwvOohJBdMB3l0CMXTIYthRNQv7H\ngEAJZvt/Z4/yfXLyzn2KPqojxXFd8yhT3jQdwtge5VHZ2Nf21K0/IsAiLcJPLVKH\nlZxPWYYCSdemQH95a1J+2UXwOLDM0xjEz1rqhm5QBtTBVPXk3L9Qd5ktYM+ERN7Q\nxIl26iE7AgMBAAECggEAExi7PbW/nZ/i9sbrdzPic20anKTdBbfUgtZ0m94CWdKv\nwDrAtsxN6vNx4EMmCnFPYJH7cs4G3hLZNdDFk4o7YECdwZLGX4YBfwpyuwnR21mT\nVIEieBRonNUWW+/3sfXtcJPOMZbQxVvmtXTI8PaKdVEhSxZymzqa1VUvT/aVbAv1\n1IfDDp/D3YF6tyfQHE3VsaRKo5NrSp1jI7hxGfMliWxxBzxqhqvJ2jf8JcvWGYSM\nkNzcxgirhXveJjS5RAsJ0vNUL9lLN5BH2HjMnxpSVLEAS/ZU3/4QZlE9UkstgnYt\nfpoLIPKWEZ6Q+qab8absNtG5pESbc/455eER9shkRQKBgQDtZGgtuQNO3gPCPm41\nxFTDsTl4BY1FFvRf8zsGl7Axv+fh23Yg4JTz4M6dCWqfFoDa5WoM8WSPPNzcmWW/\njLiPCUTdymSzK6QSUp8goes/onSBm7UChVKGHG0XVsw+GvLU0z5vfuSR+5/o4UYp\n12n9JxRlk0b/glRg1RNUQ1p4LwKBgQDAUvwScN+QrfTak7ks/xqmwSEzEPyZqG3R\n6nKKEce7z15SFJF2LvWvBHGNP2tVHulaRpVdAPDONmp1EREARekM7/u4T6tTSgEu\n0Jm14p76egzusayi5jySOJfKAP2zg94dWwdveqwqbSYhADGT2F/ZK/+ApgCmvqnQ\nzsSaT81YtQKBgQCV9x0c7UjatMQZHIlQ7ANEUJvmZ1N0NukQCD7cjkzfUMUy2AoL\nAPT4D6dWaxFxCK1EGzNgk8ob9q3rqfguBr68lXVsyyPMUCBo9srRuZg8bes9yViT\nDBgy4phD6zBBd5K5we0qUDYixpuhaVaCrjOlmd93v49VcEbPmSuJyrbHPwKBgQCE\nZBu1rhGYDMey92HPgcSc6fGqr5TTSchfal5ygQ7XUEaDhjkj++uQESUBsJh4PhEw\n3cnP/efGbFsYPylO4NEu4LyNAfrUGOt7iIlnVZtOnVntrk1Cze8AUQjcO5ZpTutF\nlfYmXXHKutw2d2WpepdwbgMyUhO8tR886DkaaLjYyQKBgAHbDpXwOV3iv+D0VT2D\nLaA7EswJbSVADqnGSg28gOSL/3653W0QukRvkUzbKrarY1OnuyNJcWjBheNrzmbb\nUG6o4OhrGQN4EZ+JaOg7Tv0Pv/vVBSbWZP2cIosXZVWMAlyIZZQvulnujt+hYhzl\n9OnIbj7gnIXcdlKuHUKB3ZEg\n-----END PRIVATE KEY-----\n',
        client_email: 'arzmeta@arzmeta-361813.iam.gserviceaccount.com',
        client_id: '115396186989098627080',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url:
          'https://www.googleapis.com/robot/v1/metadata/x509/arzmeta%40arzmeta-361813.iam.gserviceaccount.com',
      }, // always required (user auth key)
      subscription: false, // optional, if google play subscription
    };
    iap.verifyPayment(platform, payment, function (error: any, response: any) {
      /* your code */
      if (response) {
        if (response.receipt.purchaseState === 0) {
          this.logger.debug('결제 완료된 영수즈응');
          return response.receipt;
        }
        if (response.receipt.purchaseState === 1) {
          this.logger.debug('환불 영수즈응');
          return response.receipt;
        }
        if (response.receipt.purchaseState === 2) {
          this.logger.debug('결제 보류 영수즈응');
          return response.receipt;
        }

        this.logger.debug(response.receipt.purchaseState);
        return response.receipt;
      } else {
        this.logger.error(error);
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_EMPTY_PASSWORD,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        });
      }
    });
  }

  //구글 정기 결제 영수증 검증
  async postIAPGoogleBillingReceiptValidation(
    data: PostIAPGoogleReceiptValidationDto,
  ) {
    const purchaseToken = data.purchaseToken;
    const productId = data.productId;
    const packageName = data.packageName;

    // DB에 영수증 정보 존재하는지 먼저 체크
    let platform = 'google';
    // console.log(path.join(__dirname, './arzmeta-361813-41dd66d11ab6.json'));
    let payment = {
      receipt: purchaseToken, // always required (purchaseToken)
      productId: productId,
      packageName: packageName,
      keyObject: {
        type: 'service_account',
        project_id: 'arzmeta-361813',
        private_key_id: 'cc9985a207787b8b8e1751658db6cdc693cd48e3',
        private_key:
          '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDPuU4T/NkJJWWt\nriFrI2pQxSIHqJMsRsJAv8PKmTskPuBBp3OwoaPXCbQKgqmmqczkvGRBvTSjqp6R\n09HGDJc3u4Z63QaasRSGxoS1bwFlf44yvyBXbagEaldpUExvWXW/YeP0tNr1BQ3S\nn/6rqAN8EcMWIattmDz5O3Jh6h0SWpJiD7xaEFSP39fh+jcrkYfbXc6u1fkE0ibE\nCzeyc/lzgpVHeuFyFKJyWPQgDD3CPcau6MfW8gIb73IxEYcPp4XkQBBMtyL/Z5py\n3l1QH/w9hfpnDABYmBt0MJfhHGmutmz/Zf2nA2sLjYFtdzXarPj0I3L2jepslY+s\ncprkVYS5AgMBAAECggEACyKUtQVWOJNqwY5OsAy2VaVVo0m19vcFkX0+IIGJjjI5\nKQfSD69AhkXYwwH5WGvshfvz12LOPDJInQpY6cgRwJzysuofgSIaNrXUVhoA3gki\nDSYZ9JnWGoN9U1HIwSTPZy6XDs51mNIYKTjmqNrBMhDNL4XnR8EUDquxQF6xh4Le\n8UTwA0vIbgpqMvriiWwXJl2bQA3IBwtczsoFknPtU0YnjkORCNpg5YFJAD8LiC96\noegm98Ry69IrZRrXhxqfoteaMPqwXg163uhPAROWA52bWqM/uGNjFy6tBmFqU+wC\nZs1C7AGKTcj2af2mnhIjoDgjKaLbUE2an9qvYmGBIQKBgQDqPU1HsG0QGdFWJcmN\nZJtmikj7f4PTR8vEBCEotD9P8nEw1GWN7YMfti3MPQrqqvmWDgdJW9vXTTClp5T+\nsb9U3s4ksaTDgNZRs7nqM2PdJGjsd54m8ycd+QNU6OnH9M9A829ZMofc67l9aumv\n32XWtROeZX/8O8aGniJwlbigYQKBgQDjBWg2pt2Jm+olRXFlwiSNS2D7wvPP0dGq\nj4qStOYiTFbSer5xpWuzVE6bPwJAaQ11vpTveubAdksQ+mFxXw2Cs5Osu0edjXZW\nTKtdc3YYpxT8gGnzsTMgG30ckCmd/o7bnMn7/1j3D2ds6xMx2w0BhR2qe5MfGhH/\nqvp7BgijWQKBgBm4OXARsyf9bbrj00mvLlEIBhN3YOYmD/2p5motwHXqzPrrl2sK\nFUe6HTU7zqMNuvH7AFnRuEXft+O4jueYZMXQ4RmuV8UPtHisH1HT6rcxdEPirn7g\nW/8yhGciW+kUvF0JXcSRg9GCII/g2V/yS6BTqZ/OzUrI1XeajXWHOwqBAoGBAN4i\nJkyDjfXeB4ecoU6OXrGadjUiFurcRSl89nyCYURiKfodfEc7M1zvO1MQniVkJXV2\nm8iQG0Vq+hyMwdfqyA+Boxe60GJLTuU2c98m4QFSS2ieRg3a70mVXCAct3wO3r3o\ndoMK4YQtIGgkxE1eJyW7mMF91QDzw3TFWf4Sc1VRAoGBAIt9tRbs/OSmtZ860ybQ\nDMU+aBVEVgBVzgnetupYgel71IXVa6yAD4TL9D4m188jwqIjE0iYkLlDiwxqLYcM\nTUlIByZr6ayxOmoHKvE0rORm9OsQ8aht6A6rUF+L08iP2Oee6686M4jnXbu0lejy\nXJkP9B46ZK6sPdcdO0G34F/3\n-----END PRIVATE KEY-----\n',
        client_email: 'arzmetaiap@arzmeta-361813.iam.gserviceaccount.com',
        client_id: '109771755728023532286',
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url:
          'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url:
          'https://www.googleapis.com/robot/v1/metadata/x509/arzmetaiap%40arzmeta-361813.iam.gserviceaccount.com',
      }, // always required (user auth key)
      subscription: true, // optional, if google play subscription
    };
    iap.verifyPayment(platform, payment, function (error: any, response: any) {
      /* your code */
      if (response) {
        this.logger.debug(response.receipt);
        return response.receipt;
      } else {
        this.logger.error(error);
        return '결제에 실패하였습니다.';
      }
    });
  }
}
