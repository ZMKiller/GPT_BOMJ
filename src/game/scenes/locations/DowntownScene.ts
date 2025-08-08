import LocationScene from '../LocationScene';
import { LocationId } from '../../util/types';

export default class DowntownScene extends LocationScene {
  constructor() {
    super('DowntownScene', LocationId.Downtown);
  }
}
