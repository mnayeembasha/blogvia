import { UserDocument } from "../models/User";
type SafeUser = Omit<UserDocument,"password">;
declare global{
    namespace Express{
        interface Request{
            user?:SafeUser;
        }
    }
}