import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class BannersService {
    @Prop()
    Link: string;
    @Prop()
    position: number;
    @Prop()
    Identifier: string;
    @Prop()
    ImagenUrl: String;
    @Prop()
    ImageUrlApp: String;
}

export const BannersServiceSchema = SchemaFactory.createForClass(BannersService);
