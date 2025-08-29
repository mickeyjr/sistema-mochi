import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Brand {
    @Prop({required:true})
    num: number;
    @Prop({required:true})
    Brand: string;
}

export const BrandSchema = SchemaFactory.createForClass(  Brand);