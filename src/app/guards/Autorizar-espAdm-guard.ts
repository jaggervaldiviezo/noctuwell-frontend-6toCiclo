import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user-service';
import { inject } from '@angular/core';

export const espAdmguard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  let authorities=userService.getAuthorities();
  if(authorities){
    if(authorities.indexOf("SPECIALIST")>=0||authorities.indexOf("ADMIN")>=0) {
      return true;
    }
  }  
  return false;
};
