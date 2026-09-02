"""
FloodGuard AI — Copilot LLM Provider Interface
Supports disabled/structured-retrieval mode by default, with optional pluggable OpenAI/Ollama endpoints.
"""
from __future__ import annotations

import time
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any

from ...core.config import settings
from ...core.logging import get_logger

logger = get_logger(__name__)


@dataclass
class LLMResponse:
    text: str
    tokens_used: int
    model: str
    latency_ms: float
    provider: str


class CopilotLLMProvider(ABC):
    @abstractmethod
    async def chat(self, messages: list[dict[str, str]], system_prompt: str, max_tokens: int = 500) -> LLMResponse:
        pass

    @abstractmethod
    async def health_check(self) -> bool:
        pass

    @abstractmethod
    def provider_name(self) -> str:
        pass


class DisabledLLMProvider(CopilotLLMProvider):
    """Default provider: operates strictly in structured fact retrieval mode without generative synthesis."""

    async def chat(self, messages: list[dict[str, str]], system_prompt: str, max_tokens: int = 500) -> LLMResponse:
        raise NotImplementedError("Generative LLM is disabled. Operating in source-grounded structured retrieval mode.")

    async def health_check(self) -> bool:
        return True

    def provider_name(self) -> str:
        return "structured_retrieval_baseline"


class OpenAILLMProvider(CopilotLLMProvider):
    """Pluggable OpenAI / Ollama compatible endpoint."""

    def __init__(self, api_key: str, base_url: str = "", model: str = "gpt-4o-mini"):
        self.api_key = api_key
        self.base_url = base_url or "https://api.openai.com/v1"
        self.model = model

    async def chat(self, messages: list[dict[str, str]], system_prompt: str, max_tokens: int = 500) -> LLMResponse:
        import httpx
        start = time.perf_counter()
        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {
            "model": self.model,
            "messages": [{"role": "system", "content": system_prompt}] + messages,
            "max_tokens": max_tokens,
            "temperature": 0.1,
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(f"{self.base_url}/chat/completions", json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            latency = (time.perf_counter() - start) * 1000.0
            content = data["choices"][0]["message"]["content"]
            tokens = data.get("usage", {}).get("total_tokens", 0)
            return LLMResponse(
                text=content,
                tokens_used=tokens,
                model=self.model,
                latency_ms=round(latency, 2),
                provider="openai_compatible",
            )

    async def health_check(self) -> bool:
        return bool(self.api_key)

    def provider_name(self) -> str:
        return f"openai:{self.model}"


def get_llm_provider() -> CopilotLLMProvider:
    if settings.COPILOT_LLM_PROVIDER in ("openai", "ollama") and settings.COPILOT_API_KEY:
        return OpenAILLMProvider(
            api_key=settings.COPILOT_API_KEY,
            base_url=settings.COPILOT_LLM_BASE_URL,
            model=settings.COPILOT_LLM_MODEL or "gpt-4o-mini",
        )
    return DisabledLLMProvider()
