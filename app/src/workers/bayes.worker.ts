import { SandboxedJob } from 'bullmq';
import * as fs from 'fs';
import { BayesJobsModel, JobStatus } from '../jobs/models/bayes.jobs.model';
import { BayesDoc, BayesModel } from '../jobs/models/bayes.model';
import appConfig from '../config/app.config';
import { spawnSync } from 'child_process';
import connectDB, { closeDB } from '../mongoose';
import {
  deleteFileorFolder,
  fileOrPathExists,
  writeBayesFile,
  writeEqtlColocFile,
} from '@cubrepgwas/pgwascommon';

function sleep(ms) {
  console.log('sleeping');
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getJobParameters(parameters: BayesDoc) {
  return [
    String(parameters.method),
    String(parameters.prior_type),
    String(parameters.sample_size),
    String(parameters.population),
    String(parameters.chromosome),
    String(parameters.start),
    String(parameters.end),
    String(parameters.max_num_causal),
    String(parameters.min_info),
    String(parameters.min_maf),
  ];
}

export default async (job: SandboxedJob) => {
  //executed for each job
  console.log(
    'Worker ' +
      ' processing job ' +
      JSON.stringify(job.data.jobId) +
      ' Job name: ' +
      JSON.stringify(job.data.jobName),
  );

  await connectDB();
  await sleep(2000);

  //fetch job parameters from database
  const parameters = await BayesModel.findOne({
    job: job.data.jobId,
  }).exec();

  const jobParams = await BayesJobsModel.findById(job.data.jobId).exec();

  //create input file and folder
  let filename;

  //extract file name
  const name = jobParams.inputFile.split(/(\\|\/)/g).pop();

  if (parameters.useTest === false) {
    filename = `/pv/analysis/${jobParams.jobUID}/input/${name}`;
  } else {
    filename = `/pv/analysis/${jobParams.jobUID}/input/test.txt`;
  }

  //write the exact columns needed by the analysis
  writeBayesFile(jobParams.inputFile, filename, {
    marker_name: parameters.marker_name - 1,
    chr: parameters.chr - 1,
    pos: parameters.position - 1,
    effect_allele: parameters.effect_allele - 1,
    alternate_allele: parameters.alternate_allele - 1,
    zscore: parameters.zscore - 1,
  });

  if (parameters.useTest === false) {
    deleteFileorFolder(jobParams.inputFile).then(() => {
      // console.log('deleted');
    });
  }

  //assemble job parameters
  const pathToInputFile = filename;
  const pathToOutputDir = `/pv/analysis/${job.data.jobUID}/${appConfig.appName}/output`;
  const jobParameters = getJobParameters(parameters);
  jobParameters.unshift(pathToInputFile, pathToOutputDir);

  console.log(jobParameters);
  //make output directory
  fs.mkdirSync(pathToOutputDir, { recursive: true });

  // save in mongo database
  await BayesJobsModel.findByIdAndUpdate(
    job.data.jobId,
    {
      status: JobStatus.RUNNING,
      inputFile: filename,
    },
    { new: true },
  );

  await sleep(3000);
  //spawn process
  const jobSpawn = spawnSync(
    // './pipeline_scripts/pascal.sh &>/dev/null',
    './pipeline_scripts/pipeline.sh',
    jobParameters,
    { maxBuffer: 1024 * 1024 * 1024 },
  );

  console.log('Spawn command log');
  console.log(jobSpawn?.stdout?.toString());
  console.log('=====================================');
  console.log('Spawn error log');
  const error_msg = jobSpawn?.stderr?.toString();
  console.log(error_msg);

  let resultsFile = true;

  // resultsFile = await fileOrPathExists(`${pathToOutputDir}/results.txt`);

  //close database connection
  closeDB();

  if (resultsFile) {
    return true;
  } else {
    throw new Error(error_msg || 'Job failed to successfully complete');
  }

  return true;
};
