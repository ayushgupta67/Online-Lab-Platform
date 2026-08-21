import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

export const compileCode = async (req, res) => {    
    const { script, language, versionIndex, stdin ,compileOnly} = req.body;

    // throw an error if the required fields are missing
    if (!script || !language || !versionIndex) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Prepare the request data for Jdoodle API
    const requestData = {
        clientId: process.env.Jdoodle_clientID,
        clientSecret: process.env.Jdoodle_clientSecret,
        script,
        stdin: stdin || "",
        language,
        versionIndex,
        compileOnly: compileOnly, // Set to true if you only want to compile
    };

    try {
        const response = await axios.post(process.env.JDoodle_API_URL, requestData, {
            headers: { "Content-Type": "application/json" },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error executing code:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to execute code" });
    }
}