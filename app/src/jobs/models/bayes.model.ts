import * as mongoose from 'mongoose';

export enum AnalysisMethod {
  SUSIE = 'susie',
  FINEMAP = 'finemap',
}

export enum PriorType {
  NULL = 'Null',
  ONE = 'One',
  TWO = 'Two',
}

export enum Populations {
  AFR = 'afr',
  AMR = 'amr',
  EUR = 'eur',
  EAS = 'eas',
  SAS = 'sas',
}

export enum Chromosomes {
  CHR1 = '1',
  CHR2 = '2',
  CHR3 = '3',
  CHR4 = '4',
  CHR5 = '5',
  CHR6 = '6',
  CHR7 = '7',
  CHR8 = '8',
  CHR9 = '9',
  CHR10 = '10',
  CHR11 = '11',
  CHR12 = '12',
  CHR13 = '13',
  CHR14 = '14',
  CHR15 = '15',
  CHR16 = '16',
  CHR17 = '17',
  CHR18 = '18',
  CHR19 = '19',
  CHR20 = '20',
  CHR21 = '21',
  CHR22 = '22',
  CHRX = 'X',
  CHRY = 'Y',
}

//Interface that describe the properties that are required to create a new job
interface BayesAttrs {
  job: string;
  useTest: string;
  marker_name: string;
  chr: string;
  position: string;
  effect_allele: string;
  alternate_allele: string;
  zscore: string;
  method: AnalysisMethod;
  prior_type: PriorType;
  sample_size: string;
  population: Populations;
  chromosome: Chromosomes;
  start: string;
  end: string;
  max_num_causal: string;
  min_info: string;
  min_maf: string;
}

// An interface that describes the extra properties that a eqtl model has
//collection level methods
interface BayesModel extends mongoose.Model<BayesDoc> {
  build(attrs: BayesAttrs): BayesDoc;
}

//An interface that describes a properties that a document has
export interface BayesDoc extends mongoose.Document {
  id: string;
  version: number;
  useTest: boolean;
  marker_name: number;
  chr: number;
  position: number;
  effect_allele: number;
  alternate_allele: number;
  zscore: number;
  method: AnalysisMethod;
  prior_type: PriorType;
  sample_size: string;
  population: Populations;
  chromosome: Chromosomes;
  start: string;
  end: string;
  max_num_causal: number;
  min_info: number;
  min_maf: number;
}

const BayesSchema = new mongoose.Schema<BayesDoc, BayesModel>(
  {
    useTest: {
      type: Boolean,
      trim: true,
    },
    marker_name: {
      type: Number,
      trim: true,
    },
    chr: {
      type: Number,
      trim: true,
    },
    position: {
      type: Number,
      trim: true,
    },
    effect_allele: {
      type: Number,
      trim: true,
    },
    alternate_allele: {
      type: Number,
      trim: true,
    },
    zscore: {
      type: Number,
      trim: true,
    },
    method: {
      type: String,
      enum: [AnalysisMethod.SUSIE, AnalysisMethod.FINEMAP],
      trim: true,
    },
    prior_type: {
      type: String,
      enum: [PriorType.NULL, PriorType.ONE, PriorType.TWO],
      trim: true,
    },
    sample_size: {
      type: Number,
      trim: true,
    },
    population: {
      type: String,
      enum: [
        Populations.EAS,
        Populations.EUR,
        Populations.AMR,
        Populations.AFR,
        Populations.SAS,
      ],
      trim: true,
    },
    chromosome: {
      type: String,
      enum: [...Object.values(Chromosomes)],
      trim: true,
    },
    start: {
      type: String,
      trim: true,
    },
    end: {
      type: String,
      trim: true,
    },
    max_num_causal: {
      type: Number,
      trim: true,
    },
    min_info: {
      type: Number,
      trim: true,
    },
    min_maf: {
      type: Number,
      trim: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BayesJob',
      required: true,
    },
    version: {
      type: Number,
    },
  },
  {
    timestamps: true,
    versionKey: 'version',
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        // delete ret._id;
        // delete ret.__v;
      },
    },
  },
);

//increments version when document updates
BayesSchema.set('versionKey', 'version');

//collection level methods
BayesSchema.statics.build = (attrs: BayesAttrs) => {
  return new BayesModel(attrs);
};

//create mongoose model
const BayesModel = mongoose.model<BayesDoc, BayesModel>(
  'Bayes',
  BayesSchema,
  'bayes',
);

export { BayesModel };
