import * as bcrypt from 'bcryptjs';

export class BcryptAdapter {
    private readonly saltRounds = 10;

    hashPassword(password: string) {
        return bcrypt.hashSync(password, this.saltRounds);
    }

    comparePassword(password: string, hash: string) {
        return bcrypt.compareSync(password, hash);
    }
}
