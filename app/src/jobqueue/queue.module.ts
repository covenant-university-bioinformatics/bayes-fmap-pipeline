import { Inject, Module, OnModuleInit } from '@nestjs/common';
import { createWorkers } from '../workers/bayes.main';
import { BayesJobQueue } from './queue/bayes.queue';
import { NatsModule } from '../nats/nats.module';
import { JobCompletedPublisher } from '../nats/publishers/job-completed-publisher';

@Module({
  imports: [NatsModule],
  providers: [BayesJobQueue],
  exports: [BayesJobQueue],
})
export class QueueModule implements OnModuleInit {
  @Inject(JobCompletedPublisher) jobCompletedPublisher: JobCompletedPublisher;
  async onModuleInit() {
    await createWorkers(this.jobCompletedPublisher);
  }
}
