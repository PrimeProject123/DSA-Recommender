from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

# ------------------------
#  Data Models
# ------------------------

class Problem(BaseModel):
    titleSlug: str
    difficulty: str
    acRate: float
    frontendQuestionId: int
    topicTags: List[str]

class RecommendRequest(BaseModel):
    done: List[Problem]
    all: List[Problem]
    preferredTag: Optional[str] = None

# ------------------------
#  Recommender Class
# ------------------------

class Recommender:
    def __init__(self):
        print(" Loading transformer model...")
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        print(" Model loaded.")

    def _format(self, p: Problem) -> str:
        tags = ", ".join(p.topicTags)
        return f"{p.titleSlug.replace('-', ' ')} | Difficulty: {p.difficulty} | Acceptance: {p.acRate:.2f}% | Topics: {tags}"

    def suggest(self, done: List[Problem], all_problems: List[Problem], preferred_tag: Optional[str] = None, top_k: int = 50):
        done_ids = set(p.frontendQuestionId for p in done)
        not_done = [p for p in all_problems if p.frontendQuestionId not in done_ids]

        #  Cold start
        if not done:
            if preferred_tag:
                tagged = [p for p in not_done if preferred_tag.lower() in [t.lower() for t in p.topicTags]]
                tagged.sort(key=lambda p: (-p.acRate, p.difficulty != "Easy"))
                return tagged[:top_k]
            else:
                not_done.sort(key=lambda p: (-p.acRate, p.difficulty != "Easy"))
                return not_done[:top_k]

        #  Tag filtering if preferred_tag is provided
        tagged_done = []
        tagged_not_done = []
        if preferred_tag:
            tagged_done = [p for p in done if preferred_tag.lower() in [t.lower() for t in p.topicTags]]
            tagged_not_done = [p for p in not_done if preferred_tag.lower() in [t.lower() for t in p.topicTags]]

            if not tagged_done:
                tagged_not_done.sort(key=lambda p: (-p.acRate, p.difficulty != "Easy"))
                return tagged_not_done[:top_k]

            done = tagged_done
            not_done = tagged_not_done

            if not done or not not_done:
                return []

        #  Semantic + hardness-based ranking
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
#  Setup API
# ------------------------

recommender = Recommender()

@app.post("/recommend")
async def recommend(data: RecommendRequest):
    results = recommender.suggest(data.done, data.all, data.preferredTag)
    return {"suggestions": [r.dict() for r in results]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)
