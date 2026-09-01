from __future__ import annotations

import math
import re
from dataclasses import dataclass
from pathlib import Path

from app.schemas import Evidence, SourceName

TOKEN_RE = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)?", re.IGNORECASE)
HEADING_RE = re.compile(r"^(#{2,3})\s+(?:(\d+(?:\.\d+)*)\.?\s*)?(.*)$")

SOURCE_FILES: dict[SourceName, tuple[str, str, str]] = {
    "safety": ("safety_procedures.md", "SAFE-PKG07-001", "Line PKG-07 Safety Procedures"),
    "maintenance": ("maintenance_manual.md", "MAINT-PKG07-001", "Line PKG-07 Maintenance Manual"),
    "quality": ("quality_control_standards.md", "QC-PKG07-001", "Line PKG-07 Quality Control Standards"),
}

STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "by", "can", "do", "for", "from",
    "how", "i", "if", "in", "is", "it", "of", "on", "or", "the", "this", "to",
    "we", "what", "when", "where", "which", "while", "with", "without",
}


@dataclass(frozen=True)
class Chunk:
    source: SourceName
    document_id: str
    document_title: str
    section: str
    section_title: str
    text: str


class CorpusRetriever:
    def __init__(self, data_dir: Path) -> None:
        self._chunks: dict[SourceName, list[Chunk]] = {
            source: self._parse_document(source, data_dir / filename, document_id, title)
            for source, (filename, document_id, title) in SOURCE_FILES.items()
        }

    @staticmethod
    def _tokens(text: str) -> list[str]:
        return [token.lower() for token in TOKEN_RE.findall(text) if token.lower() not in STOPWORDS]

    def _parse_document(
        self,
        source: SourceName,
        path: Path,
        document_id: str,
        document_title: str,
    ) -> list[Chunk]:
        text = path.read_text(encoding="utf-8")
        chunks: list[Chunk] = []
        section = "0"
        title = "Overview"
        body: list[str] = []

        def flush() -> None:
            content = " ".join(line.strip() for line in body if line.strip())
            if content:
                chunks.append(Chunk(source, document_id, document_title, section, title, content))

        for line in text.splitlines():
            match = HEADING_RE.match(line)
            if match:
                flush()
                body = []
                section = match.group(2) or str(len(chunks) + 1)
                title = match.group(3).strip()
            elif not line.startswith("#") and not line.startswith("**Document"):
                body.append(line)
        flush()
        return chunks

    def search(self, source: SourceName, query: str, limit: int = 3) -> list[Evidence]:
        query_tokens = self._tokens(query)
        if not query_tokens:
            return []
        chunks = self._chunks[source]
        document_frequency = {
            token: sum(token in set(self._tokens(chunk.section_title + " " + chunk.text)) for chunk in chunks)
            for token in set(query_tokens)
        }
        scored: list[tuple[float, Chunk]] = []
        for chunk in chunks:
            title_tokens = self._tokens(chunk.section_title)
            body_tokens = self._tokens(chunk.text)
            body_set = set(body_tokens)
            score = 0.0
            for token in query_tokens:
                if token not in body_set and token not in title_tokens:
                    continue
                idf = math.log((len(chunks) + 1) / (document_frequency[token] + 1)) + 1
                score += idf * (2.4 if token in title_tokens else 1.0)
                score += min(body_tokens.count(token), 3) * 0.25
            if score > 0:
                scored.append((score, chunk))

        scored.sort(key=lambda item: item[0], reverse=True)
        if not scored:
            return []
        max_score = scored[0][0]
        evidence: list[Evidence] = []
        for index, (score, chunk) in enumerate(scored[:limit], start=1):
            excerpt = re.sub(r"\s+", " ", chunk.text).strip()
            if len(excerpt) > 420:
                excerpt = excerpt[:417].rsplit(" ", 1)[0] + "..."
            evidence.append(
                Evidence(
                    evidence_id=f"{source}-{chunk.section.replace('.', '-')}-{index}",
                    source=source,
                    document_id=chunk.document_id,
                    document_title=chunk.document_title,
                    document_url=f"/api/v1/documents/{chunk.document_id}",
                    section_url=(
                        f"/api/v1/documents/{chunk.document_id}"
                        f"#section-{chunk.section.replace('.', '-')}"
                    ),
                    section=chunk.section,
                    section_title=chunk.section_title,
                    excerpt=excerpt,
                    relevance=round(min(0.99, 0.45 + 0.54 * score / max_score), 2),
                )
            )
        return evidence

    def search_safety_procedures(self, query: str) -> list[Evidence]:
        return self.search("safety", query)

    def search_maintenance_manuals(self, query: str) -> list[Evidence]:
        return self.search("maintenance", query)

    def search_quality_standards(self, query: str) -> list[Evidence]:
        return self.search("quality", query)
