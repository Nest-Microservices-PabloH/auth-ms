import { IsEmail, IsString, IsStrongPassword } from "class-validator";


export class RegisterUserDto {

    @IsString()
    name: string;

    @IsEmail()
    @IsString()
    email: string;

    @IsString()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }, {
        message: 'La contraseña debe tener: • Al menos 8 caracteres • Una letra minúscula • Una letra mayúscula • Un número • Un símbolo'
    })
    password: string;

}