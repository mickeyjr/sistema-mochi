import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Series {

    @Prop({required: true})
    Serie: string
    @Prop({required: true})
    num: number
}

export const SeriesSchema = SchemaFactory.createForClass(Series);
