export interface User {
  role: USER_ROLE;
  gestionnaire: string;
  email: string;
  receive_new_demands: boolean;
  receive_old_demands: boolean;
}