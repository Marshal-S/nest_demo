import { SessionData } from "express-session";
import { User } from "./entities/user.entity";

export interface CookieExtend extends SessionData {
    user: User
}