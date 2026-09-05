"""
FloodGuard AI — Structured Logging with standard library fallback
"""
import logging
import sys
from typing import Any

try:
    import structlog
    HAS_STRUCTLOG = True
except ImportError:
    HAS_STRUCTLOG = False


class FallbackLogger:
    """Standard logging wrapper providing key-value structured signature."""
    def __init__(self, name: str):
        self._logger = logging.getLogger(name)

    def info(self, event: str, **kwargs: Any) -> None:
        self._logger.info(f"{event} {kwargs if kwargs else ''}")

    def warning(self, event: str, **kwargs: Any) -> None:
        self._logger.warning(f"{event} {kwargs if kwargs else ''}")

    def error(self, event: str, **kwargs: Any) -> None:
        self._logger.error(f"{event} {kwargs if kwargs else ''}")

    def debug(self, event: str, **kwargs: Any) -> None:
        self._logger.debug(f"{event} {kwargs if kwargs else ''}")


def configure_logging(log_level: str = "INFO", json_output: bool = True) -> None:
    log_level_int = getattr(logging, log_level.upper(), logging.INFO)

    if HAS_STRUCTLOG:
        shared_processors: list[Any] = [
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
        ]
        if json_output:
            shared_processors.append(structlog.processors.JSONRenderer())
        else:
            shared_processors.append(structlog.dev.ConsoleRenderer(colors=True))

        structlog.configure(
            processors=shared_processors,
            wrapper_class=structlog.make_filtering_bound_logger(log_level_int),
            logger_factory=structlog.PrintLoggerFactory(),
            cache_logger_on_first_use=True,
        )

    logging.basicConfig(
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        stream=sys.stdout,
        level=log_level_int,
    )


def get_logger(name: str) -> Any:
    if HAS_STRUCTLOG:
        return structlog.get_logger().bind(logger=name)
    return FallbackLogger(name)
