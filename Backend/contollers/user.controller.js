import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {

    try {
        console.log(req.body);
        const { fullname, email, phoneNumber, password, role } = req.body;
        if (!fullname, !email, !phoneNumber, !password, !role) {
            return res.status(400).json({
                message: "Missing Details",
                success: false
            })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: "Email ID Already Registered",
                success: false
            })
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        User.create({
            fullname,
            email,
            password: hashedpassword,
            phoneNumber,
            role
        })

        res.status(201).json({
            message: "New User Registered",
            success: true
        })
    }
    catch (err) {
        console.log(err);
    }

}


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email ||  !password || !role) {
            return res.status(400).json({
                message: "Missing Details",
                success: false
            })
        }
        console.log(email)
        let user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials email",
                success: false
            })
        }

        const ispasswordmatch = await bcrypt.compare(password, user.password);
        if (!ispasswordmatch) {
            return res.status(400).json({
                message: "Invalid Credentials pass",
                success: false
            })
        }

        if (user.role !== role) {
            return res.send(400).json({
                message: "Invalid Credentials for this role"
            })
        }

        const tokenData = {
            userId: user._id
        }
        // console.log(`user._id : ${tokenData.userId}`);
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });
        // console.log(`token Data in login : ${token}`);
        user = {
            _id: user.id,
            fullname: user.fullname,
            password: user.password,
            email: user.email,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true }).json({
            message: `Welcome to portal ${user.fullname}`,
            user,
            success: true
        })
    }
    catch (err) {
        console.log(err);
    }

}


export const logout = async (req, res) => {
    try {
        console.log('hello ')
        res.status(200).cookie("token",'',{ maxAge: 0 }).json({
            message: "logout"
        })

    } catch (err) {
        console.log(err);
    }

}


export const updateProfile = async (req, res) => {

    try {
        console.log("updateProfile")
        const { fullname, email, phoneNumber, skills, bio } = req.body;
        // if (!fullname, !email, !phoneNumber, !skills, !bio) {
        //     return res.status(400).json({
        //         message: "Missing Details",
        //         success: false
        //     })
        // }
        console.log("update")
        console.log(req.cookies.token)
        const userId = req.id; // middlware authentication
        let skillsArray
        if (skills) {
            skillsArray = skills.split(",");
        }
        console.log("hello")
        let user = await User.findById(userId);
        console.log(user);
        if (!user) {
            return res.status(400).json({
                message: "User Not Found",
                success: false
            })
        }
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (skills) user.profile.skills = skills;
        if (bio) user.profile.bio = bio;

        user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profileSkills: user.skills,
            profileBio: user.bio
        }

        return res.status(200).json({
            message: "Updated user Successfully",
            user,
            success: true
        })
    }
    catch (err) {

    }

}