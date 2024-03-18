import { Inject, Injectable, Res } from '@nestjs/common';
import { uuid } from 'uuidv4';
import { GetPaymentSuccessDto } from './dto/request/payment.success.dto';
import axios from 'axios';
import { GetPaymentBillingSuccessDto } from './dto/request/payment.billing.success.dto';
import { PostPaymentVbankWebhookDto } from './dto/request/payment.vbank.webhook.dto';
import { GetPaymentFailDto } from './dto/request/payment.fail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member, PaymentList, PaymentStateLog } from '@libs/entity';
import { DataSource, Repository } from 'typeorm';
import { GetPaymentBillingSuccessParamDto } from './dto/request/payment.billing.success.param.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentList)
    private paymentListRepository: Repository<PaymentList>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  // 토스 페이먼츠 결제 요청 (창 호출)
  async getTossPaymentsCall(@Res() res, customerName: string) {
    return res.render('index', {
      title: '결제하기',
      orderId: uuid(),
      customerName: customerName,
    });
  }

  // 토스 페이먼츠 결제 성공
  async getTossPaymentsSuccess(@Res() res, data: GetPaymentSuccessDto) {
    const paymentKey = data.paymentKey;
    const orderId = data.orderId;
    const amount = data.amount;

    // 결제
    if (!paymentKey) {
      return 'paymentKey가 존재하지 않습니다.';
    }

    if (!orderId) {
      return 'orderId가 존재하지 않습니다.';
    }

    if (!amount) {
      return 'amount가 존재하지 않습니다.';
    }

    let options = {
      method: 'POST',
      url: 'https://api.tosspayments.com/v1/payments/confirm',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(process.env.PAYMENTS_SECRET_KEY + ':').toString('base64'),
        'Content-Type': 'application/json',
      },
      data: {
        paymentKey: paymentKey,
        amount: amount,
        orderId: orderId,
      },
    };

    const paymentResult = await axios.request(options);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (paymentResult.data.method === '간편결제') {
        console.log('간편결제 로직 시작');
        console.log(paymentResult.data);

        const memberInfo = await this.dataSource.getRepository(Member).findOne({
          where: {
            memberId: data.memberId,
          },
        });

        const paymentListSave = new PaymentList();

        paymentListSave.orderId = paymentResult.data.orderId; // 주문 번호
        paymentListSave.orderName = paymentResult.data.orderName; // 상품 이름
        paymentListSave.memberCode = memberInfo.memberCode; // 회원 코드
        paymentListSave.nickName = memberInfo.nickname; // 닉네임
        paymentListSave.productId = Number(data.productId); // 상품 코드
        paymentListSave.count = Number(data.count); // 상품 수량
        paymentListSave.price = paymentResult.data.totalAmount; // 상품 가격
        paymentListSave.storeType = 3; // 결제 수단 3번 TOSS
        paymentListSave.paymentsData = paymentResult.data; // 결제 데이터
        paymentListSave.paymentStateType = 1; // 결제 상태 1번 결제 완료

        await queryRunner.manager
          .getRepository(PaymentList)
          .save(paymentListSave);
        await queryRunner.manager.getRepository(PaymentStateLog).save({
          orderId: paymentListSave.orderId,
          paymentStateType: 1,
          paymentCreateAt: paymentListSave.paymentCreateAt,
        });
        await queryRunner.commitTransaction();
      }

      // 간편 결제 로직
      if (paymentResult.data.method === '카드결제') {
        console.log('카드결제 로직 시작');
        console.log(paymentResult.data);
        const memberInfo = await this.dataSource.getRepository(Member).findOne({
          where: {
            memberId: data.memberId,
          },
        });

        const paymentListSave = new PaymentList();

        paymentListSave.orderId = paymentResult.data.orderId; // 주문 번호
        paymentListSave.orderName = paymentResult.data.orderName; // 상품 이름
        paymentListSave.memberCode = memberInfo.memberCode; // 회원 코드
        paymentListSave.nickName = memberInfo.nickname; // 닉네임
        paymentListSave.productId = Number(data.productId); // 상품 코드
        paymentListSave.count = Number(data.count); // 상품 수량
        paymentListSave.price = paymentResult.data.totalAmount; // 상품 가격
        paymentListSave.storeType = 3; // 결제 수단 3번 TOSS
        paymentListSave.paymentsData = paymentResult.data; // 결제 데이터
        paymentListSave.paymentStateType = 1; // 결제 상태 1번 결제 완료
        paymentListSave.paymentCreateAt = new Date();

        await queryRunner.manager
          .getRepository(PaymentList)
          .save(paymentListSave);
        await queryRunner.manager.getRepository(PaymentStateLog).save({
          orderId: paymentListSave.orderId,
          paymentStateType: 1,
          paymentCreateAt: paymentListSave.paymentCreateAt,
        });

        await queryRunner.commitTransaction();

        // console.log(`결제 카드사 : ${response.data.card.company}`);
        // console.log(`카드 번호 : ${response.data.card.number}`);

        // console.log(`카드 타입 : ${response.data.card.cardType}`);
        // console.log(`카드 번호 : ${response.data.card.number}`);
        // return '카드결제에 성공하였습니다 !';
        return res.redirect(
          `${process.env.HOMEPAGE_FRONT_URL}/shop/completion`,
        );
      }

      // 간편 결제 로직
      if (paymentResult.data.method === '카드') {
        console.log('카드 로직 시작');
        console.log(paymentResult.data);
        // console.log(`결제 카드사 : ${response.data.card.company}`);
        // console.log(`카드 번호 : ${response.data.card.number}`);

        // console.log(`카드 타입 : ${response.data.card.cardType}`);
        // console.log(`카드 번호 : ${response.data.card.number}`);
        // return '카드결제에 성공하였습니다 !';

        const memberInfo = await this.dataSource.getRepository(Member).findOne({
          where: {
            memberId: data.memberId,
          },
        });

        const paymentListSave = new PaymentList();

        paymentListSave.orderId = paymentResult.data.orderId; // 주문 번호
        paymentListSave.orderName = paymentResult.data.orderName; // 상품 이름
        paymentListSave.memberCode = memberInfo.memberCode; // 회원 코드
        paymentListSave.nickName = memberInfo.nickname; // 닉네임
        paymentListSave.productId = Number(data.productId); // 상품 코드
        paymentListSave.count = Number(data.count); // 상품 수량
        paymentListSave.price = paymentResult.data.totalAmount; // 상품 가격
        paymentListSave.storeType = 3; // 결제 수단 3번 TOSS
        paymentListSave.paymentsData = paymentResult.data; // 결제 데이터
        paymentListSave.paymentStateType = 1; // 결제 상태 1번 결제 완료

        await queryRunner.manager
          .getRepository(PaymentList)
          .save(paymentListSave);
        await queryRunner.manager.getRepository(PaymentStateLog).save({
          orderId: paymentListSave.orderId,
          paymentStateType: 1,
          paymentCreateAt: paymentListSave.paymentCreateAt,
        });

        await queryRunner.commitTransaction();

        return res.redirect(
          `${process.env.HOMEPAGE_FRONT_URL}/shop/completion`,
        );
      }

      // 가상 계좌 결제 로직
      if (paymentResult.data.method === '가상계좌') {
        console.log('가상계좌 로직 시작');

        //TODO : DB 로직 추가 예정

        if (paymentResult.data.virtualAccount) {
          console.log(
            `가상 계좌 번호 : ${paymentResult.data.virtualAccount.accountNumber}`,
          );
          console.log(
            `가상계좌 타입 : ${paymentResult.data.virtualAccount.accountType}`,
          );
          console.log(
            `가상 계좌 은행 : ${paymentResult.data.virtualAccount.bank}`,
          );
          console.log(
            `가상 계좌 은행 코드 : ${paymentResult.data.virtualAccount.bankCode}`,
          );
          console.log(
            `가상 계좌 입금 마감일 : ${paymentResult.data.virtualAccount.dueDate}`,
          );
          console.log(
            `가상 계좌 환불 처리 상태 : ${paymentResult.data.virtualAccount.refundStatus}`,
          );
          console.log(
            `가상 계좌 만료 여부 : ${paymentResult.data.virtualAccount.expired}`,
          );
        }

        // return res.send('가상 계좌 결제가 등록되었습니다.');
        return res.redirect(
          `${process.env.HOMEPAGE_FRONT_URL}/shop/completion`,
        );
      }

      // 상품권 결제 로직
      if (paymentResult.data.method === '도서문화상품권') {
        console.log('도서문화상품권');
      }

      console.log(paymentResult);
      return res.redirect(`${process.env.HOMEPAGE_FRONT_URL}/shop/completion`);
    } catch (error) {
      console.log(paymentResult);
      console.log(error);
      await queryRunner.rollbackTransaction();
      return res.redirect(`${process.env.HOMEPAGE_FRONT_URL}/shop/failed`);
    } finally {
      await queryRunner.release();
    }
  }

  // 토스 페이먼츠 빌링 결제 성공
  async getTossPaymentsBillingSuccess(
    @Res() res,
    data: GetPaymentBillingSuccessDto,
  ) {
    const authKey = data.authKey;
    const customerKey = data.customerKey;
    const amount = data.amount;
    const orderId = data.orderId;
    const orderName = data.orderName;
    const customerEmail = data.customerEmail;
    const customerName = data.customerName;

    let options = {
      method: 'POST',
      url: 'https://api.tosspayments.com/v1/billing/authorizations/issue',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(process.env.PAYMENTS_SECRET_KEY + ':').toString('base64'),
        'Content-Type': 'application/json',
      },
      data: {
        authKey: authKey,
        customerKey: customerKey,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log('@@@@@@키 발급 성공');
        console.log(response.data);
        console.log(amount);
        axios({
          method: 'POST',
          url: `https://api.tosspayments.com/v1/billing/${response.data.billingKey}`,
          headers: {
            Authorization:
              'Basic ' +
              Buffer.from(process.env.PAYMENTS_SECRET_KEY + ':').toString(
                'base64',
              ),
            'Content-Type': 'application/json',
          },
          data: {
            authKey: authKey,
            customerKey: customerKey,
            amount: amount,
            orderId: orderId,
            orderName: orderName,
            customerEmail: customerEmail,
            customerName: customerName,
          },
        })
          .then(function (response) {
            console.log(response);
            return res.redirect(
              `${process.env.HOMEPAGE_FRONT_URL}/shop/completion`,
            );
            // return res.send('아즈메타 정기구독 결제 감사합니다  ~ ~ ~ ~ ');
          })
          .catch(function (error) {
            console.log(error);
            return res.redirect(
              `${process.env.HOMEPAGE_FRONT_URL}/shop/failed`,
            );
            // return res.send('빌링 결제 실패 했어요 ㅠㅠ ');
          });

        // TODO : 비지니스 로직 추가
      })
      .catch(function (error) {
        console.log('@@@@@@결제실패');
        console.error(error);
        return res.redirect(`${process.env.HOMEPAGE_FRONT_URL}/shop/failed`);
        // return res.redirect(
        //   `api/payments/fail?message=${error.response.data.message}?code=${error.response.data.code}`,
        // );
        // TODO : 결제 실패 후 로직 협의
      });
  }

  //가상계좌 입금 통보 웹훅
  async postTossPaymentsVbankWebhook(data: PostPaymentVbankWebhookDto) {
    const createdAt = data.createdAt;
    const secret = data.secret;
    const orderId = data.orderId;
    const status = data.status;
    const transactionKey = data.transactionKey;

    console.log(`생성 일자 : ${createdAt}`);
    console.log(`비밀 키 : ${secret}`);
    console.log(`주문 번호 : ${orderId}`);
    console.log(`결제 상태 : ${status}`);
    console.log(`트랜잭션 키 : ${transactionKey}`);
    return;
  }

  //결제 실패 시 호출
  async getTossPaymentsFail(@Res() res, data: GetPaymentFailDto) {
    const message = data.message;
    const code = data.code;
    const orderId = data.code;

    // return res.render('fail', {
    //   message: message,
    //   code: code,
    //   orderId: orderId,
    // });
    return res.redirect(`${process.env.HOMEPAGE_FRONT_URL}/shop/failed`);
  }
}
