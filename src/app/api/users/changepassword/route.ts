import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import jwt from "jsonwebtoken";
import User from "@/models/userModel"
import bcryptjs from "bcryptjs"
connect();

export async function POST(request: NextRequest) {
    try {

        const { password, token } = await request.json();
        const user = await User.findOne({ forgotPasswordToken: token, forgotPasswordTokenExpiry: { $gt: Date.now() } })
        if (!user) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 400 }
            );
        }
        if (!password) {
            return NextResponse.json(
                { error: "Password is required" },
                { status: 400 }
            );
        }

        // Hash new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Update password
        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
        });

        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
