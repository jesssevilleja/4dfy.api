import { ObjectType, InputType } from '@nestjs/graphql';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from '../schema/user.schema';

@InputType('ProfileInputType', { isAbstract: true })
@ObjectType()
export class Profile {
  avatar?: Attachment;
  bio?: string;
  socials?: Social[];
  contact?: string;
  notifications?: Notifications;
}

@InputType('SocialInputType', { isAbstract: true })
@ObjectType()
export class Social {
  type: string;
  link: string;
}

@InputType('NotificationsInputType', { isAbstract: true })
@ObjectType()
export class Notifications {
  email?: string;
  enable?: boolean;
}
