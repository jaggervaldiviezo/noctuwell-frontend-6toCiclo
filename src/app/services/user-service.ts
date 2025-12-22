import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDTO } from '../models/userDTO';
import { TokenDTO } from '../models/tokenDTO';
import { UserUpdateDTO } from '../models/userUpdateDTO';
import { UserRegisterDTO } from '../models/userRegisterDTO';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  ruta_servidor: string = 'http://localhost:8080/upc';
  recurso: string = 'users';

  constructor(private http: HttpClient) {}

  login(userDTO: UserDTO) {
    return this.http
      .post<TokenDTO>(
        this.ruta_servidor + '/' + this.recurso + '/' + 'login',
        userDTO
      )
      .pipe(
        tap((data: TokenDTO) => {
          localStorage.setItem('jwtToken', data.jwtToken);
          localStorage.setItem('user_id', data.id.toString());
          localStorage.setItem('authorities', data.authorities);
        })
      );
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  }

  isLogged() {
    return this.getUserId() != 0;
  }

  getUserId() {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('user_id') !== null) {
        return parseInt(localStorage.getItem('user_id')!.toString());
      }
    }
    return 0;
  }

  getAuthorities() {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('authorities') !== null) {
        return localStorage.getItem('authorities');
      }
    }
    return '';
  }

  getToken() {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('jwtToken') !== null) {
        return localStorage.getItem('jwtToken');
      }
    }
    return '';
  }

  listAll() {
    return this.http.get<UserDTO[]>(this.ruta_servidor + '/' + this.recurso);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  hasAuthority(authority: string): boolean {
    const auths = this.getAuthorities(); // string o ""

    if (!auths) return false;

    return auths
      .split(',') // "ROLE_PATIENT,ROLE_USER" → ["ROLE_PATIENT","ROLE_USER"]
      .map((a) => a.trim()) // Sirve al home.html para validar la lista de Historia
      .includes(authority);
  }

  isPatient(): boolean {
    return this.hasAuthority('ROLE_PATIENT');
  }

  isSpecialist(): boolean {
    return this.hasAuthority('ROLE_SPECIALIST');
  }

   isAdmin(): boolean {
    return this.hasAuthority('ROLE_ADMIN');
  }

  // Método para actualizar la autoridad de un usuario
updateUserAuthority(userUpdateDTO: UserUpdateDTO) {
  const token = this.getToken();
  const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

  return this.http
    .put(
      this.ruta_servidor + '/' + this.recurso + '/update-authority',
      userUpdateDTO,  // ✅ Envía { username: "...", authorities: "..." }
      { headers }
    )
    .pipe(
      tap((response) => {
        console.log('Rol actualizado correctamente:', response);
      })
    );
}

registerUser(userRegisterDTO: UserRegisterDTO) {
    const token = this.getToken();  // Obtenemos el token JWT desde localStorage
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    // Hacemos la solicitud POST para registrar el usuario
    return this.http
      .post(this.ruta_servidor + '/' + this.recurso + '/register', userRegisterDTO, { headers })
      .pipe(
        tap((response) => {
          console.log('User registered successfully:', response);
        })
      );
  }

}
