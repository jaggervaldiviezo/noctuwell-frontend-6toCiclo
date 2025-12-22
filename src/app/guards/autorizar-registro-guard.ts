import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user-service';
import { inject } from '@angular/core';

export const autorizarRegistroGuardGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  let authorities=userService.getAuthorities();
  if(authorities){
    if(authorities.indexOf("ADMIN")>=0) {
      return true;
    }
  }  
  return false;
};
