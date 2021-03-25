import {catchError, mapTo, switchMap, tap} from "rxjs/operators";
import {EMPTY, Observable} from "rxjs";
import {PersistenceController} from "../persistence-controller";
import {handleError, handleSuccess} from "./common-handlers";
import {DiscordController} from "../discord-controller";
import {Message} from "eris";
import {Config} from "../../model/config";
import {AlreadyRegisteredError} from "../../errors/already-registered.error";

export class RegisterCommand {
    constructor(private persistence: PersistenceController, private discord: DiscordController, private config: Config) {
    }

    execute(message: Message, args: string[]): Observable<boolean> {
        const discordId = message.author.id;
        const universityId = args[0];
        if (universityId) {
            return this.registerDiscordId(discordId, universityId).pipe(
                switchMap(() => this.discord.getDMChannelForDiscordId(discordId)),
                switchMap(channelId => this.discord.sendMessageToChannelId(channelId, 'Registrado correctamente!')),
                switchMap(() => handleSuccess(this.discord, message)),
                catchError(error => handleError(this.discord, message, error))
            );
        } else {
            return EMPTY;
        }
    }

    private registerDiscordId = (discordId: string, universityId: string): Observable<boolean> => {
        return this.persistence.getRegisteredStudents().pipe(
            tap(students => {
                if (students.some(s => s.discordId === discordId)) {
                    throw new AlreadyRegisteredError();
                }
            }),
            switchMap(() => this.persistence.putRegisteredStudent(discordId, universityId).pipe(mapTo(true)))
        );
    }
}