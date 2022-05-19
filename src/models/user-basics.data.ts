import { UserRole } from "../components/enums/user-role";

export class UserBasics {
    name: string = 'Guest';
    email: string = '';
    pictureURL: string = '';
    userRole: UserRole = UserRole.GUEST;
}
