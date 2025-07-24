const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const {LeetCode , Credential} = require('leetcode-query')

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// roue to get all question in leetcode
app.get('/allQuestion', async (req, res) => {
  // res.send('API is running...');
  try {
    const leetCode = new LeetCode();
    const questions = await leetCode.problems();
    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


//body will have the Leetcode Session cookie


app.get('/acceptedQuestion/:username', async (req, res) => {
  const username = req.params.username;
  const sessionCookie = req.cookies['LEETCODE_SESSION'];

  if (!sessionCookie) {
    return res.status(400).json({ message: 'LEETCODE_SESSION cookie is required' });
  }

  try {
    const credential = new Credential();
    await credential.init(sessionCookie);
    const leetcode = new LeetCode(credential);

    // Fetch all problems
    const allProblemsData = [];
    let flag = true;
    while (flag) {
      const page = await leetcode.problems({ offset: allProblemsData.length, limit: 100 });
      console.log(`Fetched ${page.questions.length} problems, total: ${allProblemsData.length + page.questions.length}`);
      if (!page || page.questions.length === 0) {
        flag = false;
      } else {
        allProblemsData.push(...page.questions);
      }
    }

    const problemMap = {};
    allProblemsData.forEach(p => {
      problemMap[p.titleSlug] = p;
    });

    // Fetch all submissions
    let allSubmissions = [];
    let offset = 0;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
      const page = await leetcode.submissions({ offset, limit });
      console.log(`Fetched ${page.length} submissions, offset: ${offset}`);

      if (!page || page.length === 0) break;

      allSubmissions.push(...page);

      if (page.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    // Accepted problem slugs
    const acceptedSlugs = new Set(
      allSubmissions
        .filter(sub => sub.statusDisplay === 'Accepted')
        .map(sub => sub.titleSlug)
    );

    // Minimal format
    const formatProblem = (q) => ({
      titleSlug: q.titleSlug,
      difficulty: q.difficulty,
      acRate: q.acRate,
      questionFrontendId: q.questionFrontendId,
      topicTags: (q.topicTags || []).map(t => t.slug)
    });

    // Divide into done / notDone
    const done = [], notDone = [];

    allProblemsData.forEach(q => {
      const item = formatProblem(q);
      if (acceptedSlugs.has(q.titleSlug)) {
        done.push(item);
      } else {
        notDone.push(item);
      }
    });

    return res.status(200).json({ done, notDone });

  } catch (error) {
    console.error('Error fetching user questions:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});






app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
