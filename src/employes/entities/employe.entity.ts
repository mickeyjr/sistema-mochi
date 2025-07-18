import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TimeStamps } from "src/common/entities/time-stamps.entity";

@Schema({timestamps: true})
export class Employe extends TimeStamps {

    @Prop({required: true})
    IdEmploye: String;

    @Prop({ required: true })
    FullName: string;

    @Prop({ require: true })
    Age: string;
    
    @Prop({ required: true })
    Position: string;
    
    @Prop({ required: true })
    Role: String;
    
    @Prop({ required: true })
    StartDate: Date
    
    @Prop()
    Seniority?: string;
    
    @Prop()
    Address?: string;

    @Prop()
    Birthday?: string;
    
    @Prop()
    IdStore: string;
}

export const EmployeSchema = SchemaFactory.createForClass(Employe);
