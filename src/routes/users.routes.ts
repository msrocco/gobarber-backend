import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import CreatedUserService from '../services/CreateUserService';
import UpdatedUserAvatarService from '../services/UpdatedUserAvatarService';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const createdUser = new CreatedUserService();

    const user = await createdUser.execute({
        name,
        email,
        password,
    });

    delete user.password;

    return response.json(user);
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const updatedUserAvatar = new UpdatedUserAvatarService();

        const user = await updatedUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename,
        });

        delete user.password;

        return response.json(user);
    },
);

export default usersRouter;
