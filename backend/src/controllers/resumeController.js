import { generateResumeQuestions } from '../services/resumeService.js';

export async function processResume(req, res) {
  try {
    const { resumeText } = req.body;
    if (!resumeText || resumeText.trim().length < 25) {
      return res.status(400).json({ message: 'Please provide detailed resume content or experience summary.' });
    }

    const analysis = await generateResumeQuestions(resumeText);
    res.json({ analysis });
  } catch (err) {
    res.status(500).json({ message: 'Failed to process resume: ' + err.message });
  }
}

