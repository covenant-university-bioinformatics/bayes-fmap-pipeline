import { Global, Module } from '@nestjs/common';
import { JobsBayesService } from './services/jobs.bayes.service';
import { JobsBayesController } from './controllers/jobs.bayes.controller';
import { QueueModule } from '../jobqueue/queue.module';
import { JobsBayesNoAuthController } from './controllers/jobs.bayes.noauth.controller';

@Global()
@Module({
  imports: [QueueModule],
  controllers: [JobsBayesController, JobsBayesNoAuthController],
  providers: [JobsBayesService],
  exports: [],
})
export class JobsModule {}
