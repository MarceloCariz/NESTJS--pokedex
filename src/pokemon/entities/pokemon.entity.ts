import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose/dist";
import { Document } from "mongoose";

// Entrada de la coleccion - como una definicion de tabla sql
// Como se va a grabar datos en una BD
// Relacion con la BD
@Schema()
export class Pokemon extends Document {
    // El id no ya que mongo lo otorga
    @Prop({unique: true, index: true})
    name:string;
    
    @Prop({unique: true, index: true})
    no: number;
}



export const PokemonSchema = SchemaFactory.createForClass(Pokemon);