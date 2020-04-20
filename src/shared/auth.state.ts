import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Login, Logout, UrlAfterLogin, TokenExpiredLogout } from './auth.actions';
import { UsersServerService } from 'src/services/users-server.service';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

const DEFAULT_REDIRECT_AFTER_LOGIN = "/users/extended";

export interface AuthModel {
    username: string;
    token: string;
    redirectAfterLogin: string;
}

// stavova trieda
@State<AuthModel>({
    name: "auth", // string unikatny pre cele ulozisko
    defaults: {
        username: null,
        token: null,
        redirectAfterLogin: DEFAULT_REDIRECT_AFTER_LOGIN
    } // uvodne hodnoty pre AuthModel
})

@Injectable()
export class AuthState {

    // staticke metody sa pisu do triedy ako prve a az potom obycajne
    @Selector([state => state.auth.username])
    static username(username: string) {
        return username;
    }
    //alternativne
    //@Selector(/*zmenu coho ma sledovat, default len svoju triedu sleduje*/)
    //static username(currentState: AuthModel){
    //    return currentState.username;
    //}

    @Selector([state => state.auth.redirectAfterLogin])
    static redirectUrl(url: string) {
        return url;
    }

    constructor(private usersServerService: UsersServerService) { }

    ngxsOnInit() {
        this.usersServerService.checkToken().subscribe();
    }


    @Action(Login)// na vstupe ma akcie, na ktore ma reagovat
    login(ctx: StateContext<AuthModel>, action: Login) {
        console.log("spracuvavam udalost Login pre meno " + action.auth.name);


        return this.usersServerService.login(action.auth).pipe(
            tap(token => {
                ctx.patchState({// lebo len cast menime, nemenime redirectAfterLogin
                    username: action.auth.name,
                    token //token: token
                });
            })
        );
    }

    @Action([Logout, TokenExpiredLogout], { cancelUncompleted: true })
    logout(ctx: StateContext<AuthModel>, action: Logout | TokenExpiredLogout) {
        const token = ctx.getState().token;

        // nastavime v ulozisku odhlasenie
        ctx.setState({
            username: null,
            token: null,
            redirectAfterLogin: DEFAULT_REDIRECT_AFTER_LOGIN
        })

        // kontaktujeme server len ak je to logout
        // ak je expirovany token tak server kontaktovt netreba
        if (action instanceof Logout) {
            return this.usersServerService.logout(token);
        }

    }

    @Action(UrlAfterLogin)
    setUrlAfterLogin(ctx: StateContext<AuthModel>, action: UrlAfterLogin) {
        ctx.patchState({
            redirectAfterLogin: action.url
        })
    }
}