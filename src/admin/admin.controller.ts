import { Controller, Post, Query, ParseBoolPipe } from '@nestjs/common'
import { Connection } from 'typeorm'

@Controller('admin')
export class AdminController {
  constructor(private connection: Connection) {}

  @Post('reset-database')
  async resetDatabase(
    @Query('drop', ParseBoolPipe) drop: boolean,
  ): Promise<string> {
    await this.connection.synchronize()
    if (drop) await this.connection.dropDatabase()

    return 'OK'
  }
}
