from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

# ------------------------
# 🧠 Data Models
# ------------------------

class Problem(BaseModel):
    titleSlug: str
    difficulty: str
    acRate: float
    frontendQuestionId: int
    topicTags: List[str]  # Only list of tag slugs (e.g. ['array', 'dp'])

class RecommendRequest(BaseModel):
    done: List[Problem]
    notDone: List[Problem]
    preferredTag: Optional[str] = None

# ------------------------
# 🚀 Recommender Class
# ------------------------

class Recommender:
    def __init__(self):
        print("🔁 Loading transformer model...")
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        print("✅ Model loaded.")

    def _format(self, p: Problem) -> str:
        tags = ", ".join(p.topicTags)
        return f"{p.titleSlug.replace('-', ' ')} | Difficulty: {p.difficulty} | Acceptance: {p.acRate:.2f}% | Topics: {tags}"

    def suggest(self, done: List[Problem], not_done: List[Problem], preferred_tag: Optional[str] = None, top_k: int = 50):
        if not done or not not_done:
            return []

        # Specific topic requested
        if preferred_tag:
            print(f"🔍 Filtering by preferred tag: {preferred_tag}")
            filtered = [p for p in not_done if preferred_tag.lower() in [t.lower() for t in p.topicTags]]
            if not filtered:
                return []
            filtered.sort(key=lambda p: (-p.acRate, p.titleSlug))
            return filtered[:top_k]

        # General recommendation logic
        avg_ac = sum(p.acRate for p in done) / len(done)
        user_tags = set(tag for p in done for tag in p.topicTags)

        filtered = [p for p in not_done if user_tags & set(p.topicTags)]
        if not filtered:
            return []

        done_texts = [self._format(p) for p in done]
        not_done_texts = [self._format(p) for p in filtered]

        done_embeds = self.model.encode(done_texts, convert_to_tensor=True)
        not_done_embeds = self.model.encode(not_done_texts, convert_to_tensor=True)
        user_vector = done_embeds.mean(dim=0, keepdim=True)

        sims = util.cos_sim(user_vector, not_done_embeds)[0]

        scored = []
        for i, p in enumerate(filtered):
            sim = sims[i].item()
            hardness = max(0, (avg_ac - p.acRate) / 100)
            score = sim + 0.2 * hardness
            scored.append((score, p))

        scored.sort(reverse=True)
        return [p for _, p in scored[:top_k]]

# ------------------------
# 🔧 Setup API
# ------------------------

recommender = Recommender()

@app.post("/recommend")
async def recommend(data: RecommendRequest):
    results = recommender.suggest(data.done, data.notDone, data.preferredTag)
    return {"suggestions": [r.dict() for r in results]}
