import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, {AxiosInstance} from 'axios'
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapater';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeAPIResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name) /// Inyectar modelos en el sevicio
    private readonly PokemonModel:Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}
  
  private readonly axios:AxiosInstance = axios

  async executeSeed(){

    await this.PokemonModel.deleteMany({}) // delete * from pokemons;
    const data = await this.http.get<PokeAPIResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    // return  data.results;
    const pokemonToInsert:{name:string, no:number}[] = [];

    data.results.forEach(({name, url})=>{
      const segements = url.split('/');
      const no = +segements[segements.length - 2];

      pokemonToInsert.push({name, no});
    })

    await this.PokemonModel.insertMany(pokemonToInsert);
    // const insertPromisesArray = [];  
    // data.results.forEach( ({name, url})=>{
    //     const segements = url.split('/');
    //     const no:number = +segements[segements.length - 2]; //recoge el penultimo numero

    //     insertPromisesArray.push(
    //       this.PokemonModel.create({name, no})
    //     )
    // });

    // await Promise.all(insertPromisesArray); 

    return 'Seed Executed';
  }
}
