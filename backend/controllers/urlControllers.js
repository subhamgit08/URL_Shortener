import URL from "../models/urlSchema.js";
import { getAuth, requireAuth } from "@clerk/express";
import { encodeBase62 } from "../utils/Base62Converter.js";
import Counter from "../config/Counter.js";

export const make_urls = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        console.log(userId);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const { longURL } = req.body;

        if (!longURL) {
            return res.status(400).json({
                success: false,
                message: "longUrl is missing",
            })
        }

        const counter = await Counter.findByIdAndUpdate(
            "urlCounter",
            { $inc: { sequence: 1 } },
            {
                new: true,
                upsert: true,
            }
        );

        const shortCode = encodeBase62(counter.sequence);

        const newUrl = await URL.create({
            userId,
            longURL,
            shortCode,
        });

        return res.status(201).json({
            success: true,
            message: "Short URL created successfully.",
            data: {
                longURL: newUrl.longURL,
                shortCode: newUrl.shortCode,
                shortURL: `${process.env.BASE_URL}/${newUrl.shortCode}`,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }

}

export const redirectURL = async (req, res) => {

    try {

        const { shortCode } = req.params;

        const url = await URL.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({
                success: false,
                message: "URL not found.",
            });
        }

        url.clicks++;

        await url.save();

        return res.redirect(url.longURL);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};