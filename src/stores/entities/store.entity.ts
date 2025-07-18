import { TimeStamps } from "src/common/entities/time-stamps.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Store extends TimeStamps {

        @Prop({required: true})
        IdStore: string;
        
        @Prop({require: true})
        StoreName: String;

        @Prop({require: true})
        ShortName: string;
        
        @Prop({require: true})
        Latitud: number;

        @Prop({required: true})
        Longitud: number;
        
        @Prop({required:true})
        Address: string;
        
        @Prop({required: true})
        Street: string;
        
        @Prop({required: true})
        Number: string;
        
        @Prop({required: true})
        Locality: string;
        
        @Prop({required: true})
        Municipality: string;
        
        @Prop({required: true})
        State: string;
        
        @Prop({required: true})    
        Country: string;
    
}

export const StoreSchema = SchemaFactory.createForClass(Store);