export default function getLoginHandler({users, tokens}) {
    return (request, response) => {
        let userId;
        users
            .getLoginToken(db, {token: request.body.token})
            .then(token => {
                if (token && token.active && new Date() < token.expires_at) {
                    userId = token.user_id;
                    return users.createUserSession(db, {userId});
                }
    
                throw new Error('Invalid token');
            })
            .then(({id: sessionId}) => {
                response.send(tokens.makeTokens({userId, sessionId}));
            })
            .catch(error => {
                console.error(error);
                response.status(422).send({error: 'Invalid token'});
            });
    }
}