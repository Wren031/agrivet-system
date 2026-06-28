import { profileService } from '../../../services/profile.service';
import { User } from '../../../types';

export const settingsFeatureService = {
  updateProfile: profileService.updateProfile,
  changePassword: profileService.changePassword,
};
