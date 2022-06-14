import {
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
  IsEnum,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsBooleanString,
} from 'class-validator';
import {
  AnalysisMethod,
  Chromosomes,
  Populations,
  PriorType,
} from '../models/bayes.model';

export class CreateJobDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  job_name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsBooleanString()
  useTest: string;

  @IsNumberString()
  marker_name: string;

  @IsNumberString()
  chr: string;

  @IsNumberString()
  position: string;

  @IsNumberString()
  effect_allele: string;

  @IsNumberString()
  alternate_allele: string;

  @IsNumberString()
  zscore: string;

  @IsNotEmpty()
  @IsEnum(AnalysisMethod)
  method: AnalysisMethod;

  @IsNotEmpty()
  @IsEnum(PriorType)
  prior_type: PriorType;

  @IsNumberString()
  sample_size: string;

  @IsNotEmpty()
  @IsEnum(Populations)
  population: Populations;

  @IsNotEmpty()
  @IsEnum(Chromosomes)
  chromosome: Chromosomes;

  @IsNumberString()
  start: string;

  @IsNumberString()
  end: string;

  @IsNumberString()
  max_num_causal: string;

  @IsNumberString()
  min_info: string;

  @IsNumberString()
  min_maf: string;
}
