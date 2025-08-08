import LocationScene from '../LocationScene';
import { LocationId } from '../../util/types';

export default class JobCenterScene extends LocationScene {
  constructor() {
    super('JobCenterScene', LocationId.JobCenter);
  }
}
