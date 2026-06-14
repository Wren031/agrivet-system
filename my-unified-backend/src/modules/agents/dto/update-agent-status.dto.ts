import { IsEnum } from 'class-validator';
import { AgentStatus } from '@prisma/client';

export class UpdateAgentStatusDto {
  @IsEnum(AgentStatus)
  status: AgentStatus;
}
