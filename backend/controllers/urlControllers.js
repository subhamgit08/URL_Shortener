import URL from "../models/urlSchema.js";
import { getAuth, requireAuth } from "@clerk/express";
import { encodeBase62 } from "../utils/Base62Converter.js";
import Counter from "../config/Counter.js";
import redisClient from "../config/redis.js";

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

        const cacheKey = `url:${shortCode}`;
        await redisClient.setEx(cacheKey, 86400, longURL);

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
        const cacheKey = `url:${shortCode}`;

        await redisClient.hIncrBy("url_clicks", shortCode, 1);

        const cachedLongUrl = await redisClient.get(cacheKey);

        if (cachedLongUrl) {
            console.log("CACHE HIT:", cacheKey);
            return res.redirect(cachedLongUrl);
        }
        console.log("CACHE MISS:", cacheKey);

        const url = await URL.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({
                success: false,
                message: "URL not found.",
            });
        }

        await redisClient.setEx(cacheKey, 86400, url.longURL);

        return res.redirect(url.longURL);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });

    }
};