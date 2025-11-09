import { v4 as uuidv4 } from "uuid";
export function generateTeamCode() {
    // simple 8-char code, uppercase
    return uuidv4().split("-")[0].toUpperCase();
}
