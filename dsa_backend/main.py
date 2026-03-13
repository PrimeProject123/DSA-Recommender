import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

# Add CORS middleware
allowed_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "model_loaded": recommender is not None if 'recommender' in dir() else False}

# ------------------------
#  Data Models
# ------------------------

class Problem(BaseModel):
    titleSlug: str
    difficulty: str
    acRate: float
    frontendQuestionId: int
    topicTags: List[str]
    isPaidOnly: Optional[bool] = False

class RecommendRequest(BaseModel):
    done: List[Problem]
    all: List[Problem]
    preferredTag: Optional[str] = None
    hasPremium: Optional[bool] = False
    count: Optional[int] = 10

    @validator('all')
    def validate_all_size(cls, v):
        if len(v) > 5000:
            raise ValueError('Too many problems in request (max 5000)')
        return v

    @validator('done')
    def validate_done_size(cls, v):
        if len(v) > 5000:
            raise ValueError('Too many solved problems in request (max 5000)')
        return v

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

    def suggest(self, done: List[Problem], all_problems: List[Problem], preferred_tag: Optional[str] = None, has_premium: bool = False, top_k: int = 50):
        done_ids = set(p.frontendQuestionId for p in done)
        not_done = [p for p in all_problems if p.frontendQuestionId not in done_ids]
        
        # Filter out premium problems if user doesn't have premium
        if not has_premium:
            not_done = [p for p in not_done if not p.isPaidOnly]

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
        
        # Remove duplicates by frontendQuestionId
        seen = set()
        unique_results = []
        for _, p in scored:
            if p.frontendQuestionId not in seen:
                seen.add(p.frontendQuestionId)
                unique_results.append(p)
                if len(unique_results) >= top_k:
                    break
        
        return unique_results

# ------------------------
#  Setup API
# ------------------------

recommender = Recommender()

@app.post("/recommend")
async def recommend(data: RecommendRequest):
    try:
        print(f"\n🤖 Recommendation Request:")
        print(f"   - Problems solved: {len(data.done)}")
        print(f"   - Total problems: {len(data.all)}")
        print(f"   - Preferred tag: {data.preferredTag or 'None'}")
        print(f"   - Has premium: {data.hasPremium}")
        print(f"   - Requested count: {data.count}")
        
        results = recommender.suggest(data.done, data.all, data.preferredTag, data.hasPremium, top_k=data.count)
        
        print(f"\n✅ Generated {len(results)} recommendations:")
        for i, r in enumerate(results[:5], 1):  # Show first 5
            print(f"   {i}. {r.titleSlug} ({r.difficulty}) - {r.acRate:.1f}% acceptance")
        if len(results) > 5:
            print(f"   ... and {len(results) - 5} more\n")
        
        return {"suggestions": [r.dict() for r in results]}
    except Exception as e:
        print(f"❌ Recommendation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate recommendations")

if __name__ == "__main__":
    import uvicorn
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host=host, port=port, reload=False)
