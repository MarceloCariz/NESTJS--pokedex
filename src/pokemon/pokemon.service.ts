import { isValidObjectId, Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose/dist/common';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit:number; 

  // Inyeccion de dependencias se hace con el contructor
  constructor(
    @InjectModel(Pokemon.name) /// Inyectar modelos en el sevicio
    private readonly PokemonModel:Model<Pokemon>,
    private readonly configService: ConfigService
  ){
    this.defaultLimit = configService.get<number>('defaultLimit')
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.PokemonModel.create(createPokemonDto);
      return pokemon;    
    } catch (error) {
          this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {

    const {limit = this.defaultLimit , offset = 0} = paginationDto;

    return this.PokemonModel.find()
      .limit(limit)
      .skip(offset)
      .sort({no: 1})
      .select('-__v');
  }

  async findOne(term: string) {

    let pokemon: Pokemon;
    if(!isNaN(+term)){
      pokemon = await this.PokemonModel.findOne({no: term})
    }

    // Mongo Id
    if(!pokemon && isValidObjectId(term)){
      pokemon = await this.PokemonModel.findById(term)
    }

    if(!pokemon){
      pokemon = await this.PokemonModel.findOne({name: term.toLocaleLowerCase().trim()})
    }

    if(!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`)

    return pokemon;
  }

  async update(term:string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);

    if(updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto, {new: true});
      return {...pokemon.toJSON(), ...updatePokemonDto};
    } catch (error) {
      this.handleExceptions(error);
    }

  }

  async remove(id: string) {

    // const pokemon = await this.findOne(id)
    // await pokemon.deleteOne();

    const {deletedCount} = await this.PokemonModel.deleteOne({_id:id});
    if(deletedCount === 0){
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if(error.code === 11000){
      throw new BadRequestException(`Pokemon exist in db ${JSON.stringify(error.keyValue)}`)
    }else{
      console.log(error);
      throw new InternalServerErrorException('Cant create pokemon - check server logs')
    }
  }
}
