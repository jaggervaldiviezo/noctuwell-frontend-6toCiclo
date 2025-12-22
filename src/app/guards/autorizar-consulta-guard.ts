import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user-service';

export const autorizarConsultaGuardGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  let authorities=userService.getAuthorities();
  if(authorities){
    if(authorities.indexOf("ADMIN")>=0 ||authorities.indexOf("SPECIALIST")>=0 ||authorities.indexOf("PATIENT")>=0) {
      return true;
    }
  }  
  return false;
};
