import { NestFactory } from '@nestjs/core'
import { AppModule } from './app-module'
import { ValidationPipe } from '@nestjs/common'
import { nodeEnv} from './env'
import * as env from './env'


async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.enableCors({
    origin: nodeEnv.is.local,
  })
  await app.listen(env.port, env.host)
}

bootstrap()
