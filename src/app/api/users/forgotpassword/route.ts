import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        // Read cookie
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.TOKEN_SECRET!
        ) as {
            id: string;
        };

        // Find user
        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Send reset email
        await sendEmail({
            email: user.email,
            emailType: "RESET",
            userId: user._id,
        });

        return NextResponse.json({
            success: true,
            message: "Password reset email sent",
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}