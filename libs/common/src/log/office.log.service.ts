import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
import {
  CreateOffice,
  UpdateOffice,
  WaitDeleteOffice,
  WaitOffice,
} from '@libs/mongodb';
// import { Model } from 'mongoose';

@Injectable()
export class OfficeLogService {
  constructor() {} // @InjectModel('waitDeleteOffice') private readonly waitDeleteOffice: Model<WaitDeleteOffice>, // @InjectModel('waitOffice') private readonly waitOffice: Model<WaitOffice>, // @InjectModel('updateOffice') private readonly updateOffice: Model<UpdateOffice>, // @InjectModel('createOffice') private readonly createOffice: Model<CreateOffice>,
  // 오피스 예약 로그 추가
  OfficeReservGenerator(result): any {
    // const roomCode = result.memberReservationInfo.roomCode;
    // const data = result.memberReservationInfo;
    // const newUser = new this.createOffice({
    //   roomCode,
    //   data,
    // });
    // newUser.save();
    // return;
  }

  // 오피스 수정 로그 추가
  updateOfficeReserv(result): any {
    // const roomCode = result.memberReservationInfo.roomCode;
    // const data = result.memberReservationInfo;
    // const newUser = new this.updateOffice({
    //   roomCode,
    //   data,
    // });
    // newUser.save();
    // return;
  }

  // 오피스 관심 예약 하기 로그 추가
  waitOfficeReserv(result): any {
    // const roomCode = result.memberReservationInfo.roomCode;
    // const data = result.memberReservationInfo;
    // const newUser = new this.waitOffice({
    //   roomCode,
    //   data,
    // });
    // newUser.save();
    // return;
  }

  // 오피스 관심 예약 취소 하기 로그 추가
  deleteWaiting(result): any {
    // const roomCode = result.memberReservationInfo.roomCode;
    // const data = result.memberReservationInfo;
    // const newUser = new this.waitDeleteOffice({
    //   roomCode,
    //   data,
    // });
    // newUser.save();
    // return;
  }
  // 조회
  //   async getUser() {
  //     const user = await this.userModel.find();
  //     console.log(user);
  //     return user;
  //   }
}
