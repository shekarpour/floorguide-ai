from __future__ import annotations

import asyncio
from typing import TypeVar

from pydantic import BaseModel

T = TypeVar("T", bound=BaseModel)


class GeminiStructuredClient:
    """Small adapter around Google GenAI structured outputs."""

    def __init__(self, api_key: str, model: str) -> None:
        from google import genai

        self._client = genai.Client(api_key=api_key)
        self.model = model

    async def generate(self, prompt: str, schema: type[T]) -> T:
        def _call() -> T:
            response = self._client.models.generate_content(
                model=self.model,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": schema,
                    "temperature": 0.1,
                },
            )
            if response.parsed is not None:
                parsed = response.parsed
                return parsed if isinstance(parsed, schema) else schema.model_validate(parsed)
            return schema.model_validate_json(response.text)

        return await asyncio.to_thread(_call)

