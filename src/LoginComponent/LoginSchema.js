import * as joi from 'joi';

export default loginSchema = joi.object().options({abortEarly: false}).keys({
    email: joi.string()
        .email({ tlds: false })
        .required(),
    password: joi.string()
        .pattern(/[-_\./\+=\[\]\|\*\&\^\%\$\#\@\!]/, 'special')
        .pattern(/[A-Z]/, 'uppercase')
        .pattern(/\d/, 'number')
        .pattern(/[a-z]/, 'lowercase')
        .min(8)
        .required()
});