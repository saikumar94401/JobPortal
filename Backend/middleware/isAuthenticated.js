import jwt from 'jsonwebtoken'


export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({
                message: "User Not Authenticated",
                success: false
            })
        }
        const decode = jwt.verify(token, process.env.SECRECT_KEY);
        if (!decode) {
            return res.status(400).json({
                message: "User Token",
                success: false
            })
        }
        req.id=decode.userId;
        next();
    }

    catch (err) {
        console.log(err);
    }

}