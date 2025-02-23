const express = require('express');
const { getFavPhaseDates } = require('./lunarPhaseCal');
const favPhasesRoutes = require('./routes').favPhasesRoutes;

const router = express.Router();

const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Personal access token
});

// Get the next dates of the favorite moon phases
router.post(favPhasesRoutes.getFavPhases, (req, res) => {
    try {
        const favPhasesList = req.body.phasesList;

        const favPhasesDate = getFavPhaseDates({favPhasesList})

        res.status(200).json({ message: "Dates of favorite phases fetched successfully", dates: favPhasesDate });
    } catch (error) {
        console.error("Error getting phases:", error);
        res.status(400).json({ error: "Failed to fetch dates of favorite phases" });
    }
});


router.get(favPhasesRoutes.readFavPhases, async (req, res) => {
    try {
        const { data, sha } = await readFromGitHub();
        res.json({ data, sha });
    } catch (error) {
        console.error("Read error:", error);
        res.status(400).json({ error: "Failed to fetch the favorite phases" });
    }
});

// Read JSON from GitHub
async function readFromGitHub() {
    try {
        const response = await octokit.repos.getContent({
        owner: "sailormoonbot",
        repo: "sailor-moon-data",
        path: "favPhases.json"
        });
        return {
            data: JSON.parse(Buffer.from(response.data.content, "base64").toString()),
            sha: response.data.sha // Capture the SHA
        };
    } catch(error) {
        throw error;
    }
    
  }

//Write JSON to GitHub
router.post(favPhasesRoutes.editFavPhases, async (req, res) => {
    try {
        await saveToGitHub(req.body.data, req.body.sha);

        res.status(200).json({ message: "Lunar data updated successfully"});
    } catch (error) {
        console.error("Failed to update favorite phases list:", error);
        res.status(400).json({ error: "Failed to update favorite phases list" });
    }
});

// Save JSON to GitHub
async function saveToGitHub(data, sha) {
    try {
        await octokit.repos.createOrUpdateFileContents({
        owner: "sailormoonbot",
        repo: "sailor-moon-data",
        path: "favPhases.json",
        message: `Update: ${new Date().toISOString()}`,
        content: Buffer.from(JSON.stringify(data)).toString("base64"),
        sha: sha
        });
    } catch(error) {
        console.error("GitHub API Error:", error);
        throw new Error(`GitHub operation failed: ${error.message}`);
    }
  }


module.exports = router;
