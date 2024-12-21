
const validate = (token:any) => {
    const validationToken = true;
    if(!validationToken || !token) {
        return false;
    }
    return true;;
}

export function authMiddleware(req: Request):any{
    const token = req.headers.get('authorization')?.split(' ')[1];

    return {isValid: validate(token)};
}