import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class BannersService {
    @Prop()
    Imagen: Buffer;
    @Prop()
    Link: string;
    @Prop()
    position: number;
    @Prop()
    Identifier: string;
    @Prop()
    Mimetype: String;
    @Prop()
    ImageApp: Buffer;
    @Prop()
    MimetypeApp: String; 
}

export const BannersServiceSchema = SchemaFactory.createForClass(BannersService);
