import { Types } from "mongoose";

export abstract class TimeStamps {
  createdAt: Date;
  updatedAt: Date;
  _id?: Types.ObjectId;
}
